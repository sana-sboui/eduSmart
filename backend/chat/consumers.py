import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from accounts.models import User
from group.models import Group
from .models import Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.room_group_name = f"chat_{self.group_id}" 

        # Join Redis group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        # Fetch and send old messages
        messages = await self.get_group_messages(self.group_id)
        await self.send(text_data=json.dumps({
            'type': 'chat_history',
            'messages': messages
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        message = data['message']
        user_id = data['user_id']
        
        # Fetch the user object
        user = await sync_to_async(User.objects.get)(id=user_id)
        username = user.username

        # Save message in DB
        await self.save_message(user_id, self.group_id, message)

        # Send message to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_id': user_id,
                'username':username
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'username':event['username'],
            'user_id': event['user_id']
        }))

    @sync_to_async
    def save_message(self, user_id, group_id, message):
        user = User.objects.get(id=user_id)
        group = Group.objects.get(id=group_id)
        Message.objects.create(sender=user, group=group, content=message)
    
    @sync_to_async
    def get_group_messages(self, group_id):
        """Fetch all previous messages in a group"""
        messages = Message.objects.filter(group_id=group_id).select_related('sender').order_by('timestamp')
        return [
            {
                'id': msg.id,
                'sender': msg.sender.username,
                'content': msg.content,
                'timestamp': msg.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            }
            for msg in messages
        ]
