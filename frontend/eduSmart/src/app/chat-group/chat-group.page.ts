import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../models/chatMessage.models';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
  IonInput,
  IonList,
  IonLabel,
} from '@ionic/angular/standalone';
import { ChatService } from '../services/chat/chat-service';
import { Auth } from '../services/auth/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.page.html',
  styleUrls: ['./chat-group.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonInput,
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonToolbar,
    IonHeader,
    IonTitle,
  ],
})
export class ChatGroupPage {
  constructor(
    private chatService: ChatService,
    private authService: Auth,
    private route: ActivatedRoute
  ) {}
  ws!: WebSocket;
  groupId = 1;

  messages = signal<ChatMessage[]>([]);
  newMessage = '';

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.connectWebSocket();
  }

  ngOnDestroy() {
    if (this.ws) this.ws.close();
  }

  connectWebSocket() {
    if (!this.groupId) {
      console.error('Aucun ID de groupe trouvé');
      return;
    }
    this.ws = new WebSocket(`ws://127.0.0.1:8010/ws/chat/${this.groupId}/`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'chat_history') {
        // history comes as [{sender, content, timestamp}, ...]
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
            sender: `User ${data.user_id}`,
            content: data.message,
          },
        ]);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error', err);
    };
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const payload = {
      user_id: this.authService.getLoggedInUser()?.id,
      message: this.newMessage,
    };

    this.ws.send(JSON.stringify(payload));
    this.newMessage = '';
  }
}
