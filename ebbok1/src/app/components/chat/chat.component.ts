import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: string = '';
  messages: string[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.getMessage().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = ''; // Clear input after sending
    }
  }
}
