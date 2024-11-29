import { Component, TemplateRef, ViewChild } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SopsComponent } from '../sops/sops.component';

export interface ChatMessage {
  sender: string;
  content: string;
  timestamp?: Date;
  read: boolean;
}

@Component({
  selector: 'app-chat-widget',
  standalone: false,
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.scss'
})
export class ChatWidgetComponent {
  @ViewChild('transcriptModal') transcriptModal!: TemplateRef<any>;
  @ViewChild('aiModal') aiModal!: TemplateRef<any>;
  isOpen: boolean = false;
  isModalOpen: boolean = false;
  isAIModalOpen: boolean = false;
  messageInput: string = '';
  messages: ChatMessage[] = [];
  unreadCount: number = 0;
  private messagesSubscription!: Subscription;
  showFabButtons = false;
  isConnected: boolean = false;
  showNotifications: boolean = false;
  constructor(private websocketService: WebsocketService,private dialog: MatDialog) {}
  selectedTabIndex: number = 0;
  unreadAlertCount: number = 0;
  dialogRef!: MatDialogRef<any>;
  ngOnInit(): void {
    this.updateUnreadAlertCount();
  }

  notificationData: any = {
    alerts: [
      { id: '1', message: 'Your leave request has been approved!', isRead: false, timestamp: new Date().toISOString() },
      { id: '2', message: 'New comment on your project update.', isRead: false, timestamp: new Date().toISOString() },
      { id: '3', message: 'Server maintenance scheduled for this weekend.', isRead: false, timestamp: new Date().toISOString() },
      { id: '4', message: 'Budget proposal review deadline extended.', isRead: false, timestamp: new Date().toISOString() },
      { id: '5', message: 'Urgent: Client feedback required by EOD.', isRead: false, timestamp: new Date().toISOString() }
    ],
    sops: [
      { id: 'greeting', title: 'Welcome to the System', description: 'This is a greeting message for the user when they log in.', received: false },
      { id: 'procedure1', title: 'Password Reset', description: 'Steps for resetting your password securely.', received: true },
      { id: 'procedure2', title: 'Contact Support', description: 'Steps to reach out to support if you encounter any issues.', received: false },
      { id: 'procedure3', title: 'Support', description: 'you encounter any issues.', received: true }
    ]
  };
  displayedNotifications = this.notificationData.sops.slice(0, 3);
  showAll = false;
  updateUnreadAlertCount(): void {
    this.unreadAlertCount = this.notificationData.alerts.filter((alert: { isRead: any; }) => !alert.isRead).length;
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

            if (parsedMessage.content.startsWith('<form')) {
              const formContainer = document.getElementById('form-container');
              if (formContainer) {
                formContainer.innerHTML = parsedMessage.content;
              }
            } else {
              const newMessage: ChatMessage = {
                sender: parsedMessage.sender,
                content: parsedMessage.content,
                timestamp: parsedMessage.timestamp ? new Date(parsedMessage.timestamp) : new Date(),
                read: false,
              };
              this.messages.push(newMessage);
              this.unreadCount++;
            }
          } catch (error) {
            console.error('Failed to parse message:', error, message);
          }
        }
      );
    }
  }
  showsopdetail(notification: any, sopDetailTemplate: TemplateRef<any>): void {
    this.dialogRef = this.dialog.open(sopDetailTemplate, {
      data: notification
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
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
  toggleNotifications() {
    // Toggle the visibility of notifications
    this.showAll = !this.showAll;
    this.displayedNotifications = this.showAll
      ? this.notificationData.sops
      : this.notificationData.sops.slice(0, 3);
    if (!this.isOpen) {
      this.selectedTabIndex = 1;
      this.isOpen = true;
    }
  }

  openTranscriptModal(): void {
    this.isModalOpen = true;
  }
  closeTranscriptModal(): void {
    this.isModalOpen = false;
    console.log('Modal closed.');
  }
  openAIModal(){
    this.isAIModalOpen= true;
  }
  closeAIModal(){
    this.isAIModalOpen= false;
  }

  markNotificationAsRead(notification: any): void {
    if (!notification.isRead) {
      notification.isRead = true;
      this.unreadCount--;
      this.unreadAlertCount--;
    }
  }
  markSopAsReceived(sopId: string): void {
    const sop = this.notificationData.sops.find((sop: any) => sop.id === sopId);
    if (sop) {
      sop.received = true;
    }
  }
  sendMessage(): void {
    if (this.messageInput.trim()) {
      this.websocketService.send(this.messageInput);
      const newMessage: ChatMessage = {
        sender: 'Me',
        content: this.messageInput,
        read: true,
      };
      this.messages.push(newMessage);
      this.messageInput = '';
    }
  }
  showTab = false;

  toggleTab() {
    console.log("Show Tab")
    this.showTab = !this.showTab;
  }


  markAsRead(message: ChatMessage): void {
    if (!message.read) {
      message.read = true;
      this.unreadCount--;
    }
  }

  ngOnDestroy(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    this.websocketService.disconnect();
  }
}
