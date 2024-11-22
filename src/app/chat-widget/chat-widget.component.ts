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
  onDragStart(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', '');
    }
    this.dragging = true;
  }


  onDrag(event: DragEvent): void {
    if (this.dragging && event.clientX > 0 && event.clientY > 0) {
      this.position.x = event.clientX;
      this.position.y = event.clientY;
    }
  }


  onDragEnd(event: DragEvent):  void {
    console.log('Drag ended', event);

    this.dragging = false;
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
