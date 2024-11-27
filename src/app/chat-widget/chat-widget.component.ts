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
  // private isDragging = false;
  // private offsetX: number = 0;
  // private offsetY: number = 0;
  showFabButtons = false;
  isConnected: boolean = false;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {

  }
  startConnection(): void {
    if (!this.isConnected) {
      this.websocketService.connect('ws://localhost:8080');
      this.isConnected = true;

      this.messagesSubscription = this.websocketService.messages.subscribe(
        (message: any) => {
          try {
            const parsedMessage =
              typeof message === 'string' ? JSON.parse(message) : message;
            this.messages.push({
              sender: parsedMessage.sender,
              content: parsedMessage.content,
              timestamp: parsedMessage.timestamp
                ? new Date(parsedMessage.timestamp)
                : new Date(),
            });
          } catch (error) {
            console.error('Failed to parse message:', error, message);
          }
        }
      );
    }
  }

  stopConnection(): void {
    if (this.isConnected) {
      this.websocketService.disconnect();
      this.isConnected = false;

      if (this.messagesSubscription) {
        this.messagesSubscription.unsubscribe();
      }
    }
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
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    this.websocketService.disconnect();
  }


}
