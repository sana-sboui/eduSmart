import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../models/chatMessage.models';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonInput,
  IonIcon,
  IonText,
  IonAvatar,
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
    IonIcon,
    IonText,
    IonAvatar,
  ],
})
export class ChatGroupPage {
  groupId!: number;
  currentUser = this.authService.getCurrentUser();
  private shouldScrollToBottom = true;
  newMessage = '';

  constructor(
    private chatService: ChatService,
    private authService: Auth,
    private route: ActivatedRoute
  ) {}

  @ViewChild(IonContent) ionContent!: IonContent;
  private previousMessageCount = 0;

  ngOnInit() {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.chatService.connect(this.groupId);
  }

  ngAfterViewChecked() {
    // Scroll to bottom when view is checked and we have messages
    if (this.shouldScrollToBottom && this.chatService.messages().length > 0) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngAfterContentChecked() {
    const currentCount = this.chatService.messages().length;

    // 👇 scroll only when a new message arrives
    if (currentCount !== this.previousMessageCount) {
      this.previousMessageCount = currentCount;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  isCurrentUser(message: ChatMessage): boolean {
    return message.sender === this.currentUser.username;
  }

  getInitials(username: string): string {
    if (!username) return '?';

    // Split by spaces and take first 2 letters
    const names = username.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }

  scrollToBottom() {
    if (this.ionContent) {
      this.ionContent.scrollToBottom(300); // 300ms animation
    }
  }

  get messages() {
    return this.chatService.messages;
  }
}
