import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket!: WebSocketSubject<any>;

  connect(groupName: string) {
    const url = `ws://127.0.0.1:8010/ws/chat/${groupName}/`;
    this.socket = new WebSocketSubject(url);
    return this.socket;
  }

  sendMessage(message: string) {
    if (this.socket) {
      this.socket.next({ message });
    }
  }

  close() {
    this.socket?.complete();
  }
}
