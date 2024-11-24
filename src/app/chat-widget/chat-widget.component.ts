import { Component } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Subscription } from 'rxjs';

export interface ChatMessage {
  sender: string;
  content: string;
  timestamp?: Date;
}
@Component({
  selector: 'app-chat-widget',
  standalone: false,
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.scss'
})
export class ChatWidgetComponent {
  isOpen: boolean = false;
  messageInput: string = '';
  messages: ChatMessage[] = [];
  private messagesSubscription!: Subscription;
  position = { x: 50, y: 50 };
  dragging: boolean = false;
  showFabButtons = false;


  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.websocketService.connect('ws://localhost:8080');
    this.messagesSubscription = this.websocketService.messages.subscribe((message) => {
      this.messages.push({ sender: 'Server', content: message });
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }
  toggleFab() {
    this.showFabButtons = !this.showFabButtons;
  }
  mute() {
    console.log('Mute button clicked');
  }
  askQuestion() {
    console.log('Question button clicked');
  }

  showNotifications() {
    console.log('Notification button clicked');
  }

  sendMessage(): void {
    if (this.messageInput.trim()) {
      this.websocketService.send(this.messageInput);
      this.messages.push({ sender: 'Me', content: this.messageInput });
      this.messageInput = '';
    }
  }

  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
    this.websocketService.disconnect();
  }
}
