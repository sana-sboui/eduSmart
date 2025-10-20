import { Injectable, signal } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { ChatMessage } from 'src/app/models/chatMessage.models';
import { Auth } from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private ws!: WebSocket;
  messages = signal<ChatMessage[]>([]);
  private groupId!: string;

  constructor(private authService: Auth) {}

  connect(groupId: string) {
    this.groupId = groupId;
    this.ws = new WebSocket(`ws://127.0.0.1:8010/ws/chat/${groupId}/`);

    this.ws.onopen = () => console.log('WebSocket connected');
    this.ws.onclose = () => console.log('WebSocket disconnected');
    this.ws.onerror = (err) => console.error('WebSocket error', err);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'chat_history') {
        this.messages.set(
          data.messages.map((m: any) => ({
            sender: m.sender,
            content: m.content,
            timestamp: m.timestamp,
          }))
        );
      } else if (data.type === 'chat_message') {
        this.messages.update((msgs) => [
          ...msgs,
          {
            sender: data.username,
            content: data.message,
          },
        ]);
      }
    };
  }

  disconnect() {
    if (this.ws) this.ws.close();
  }

  sendMessage(message: string) {
    if (!message.trim()) return;

    const payload = {
      user_id: this.authService.getLoggedInUser()?.id,
      message,
      username: this.authService.getCurrentUser().username,
    };

    this.ws.send(JSON.stringify(payload));
  }
}
