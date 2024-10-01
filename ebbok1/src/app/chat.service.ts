import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private messageSubject = new Subject<string>();

  constructor() {
    this.socket = io('http://localhost:5000'); // Replace with your server URL
  }

  sendMessage(message: string) {
    this.socket.emit('sendMessage', message);
  }

  getMessage() {
    this.socket.on('receiveMessage', (message: string) => {
      this.messageSubject.next(message);
    });
    return this.messageSubject.asObservable();
  }
}
