import { Component, Inject, Input,EventEmitter,Output  } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


interface SOP {
  id: string;
  title: string;
  description: string;
  received: boolean;  // Indicates whether the SOP has been received
}
@Component({
  selector: 'app-sops',
  standalone: false,

  templateUrl: './sops.component.html',
  styleUrl: './sops.component.scss'
})
export class SopsComponent {
  // @Input() isOpen = false;
  // @Output() close = new EventEmitter<void>();

  // closeModal() {
  //   this.isOpen = false;
  //   this.close.emit();
  // }
  // notificationData: any = {
  //   alerts: [
  //     { id: '1', message: 'Your leave request has been approved!', isRead: false, timestamp: new Date().toISOString() },
  //     { id: '2', message: 'New comment on your project update.', isRead: false, timestamp: new Date().toISOString() },
  //     { id: '3', message: 'Server maintenance scheduled for this weekend.', isRead: false, timestamp: new Date().toISOString() },
  //     { id: '4', message: 'Budget proposal review deadline extended.', isRead: false, timestamp: new Date().toISOString() },
  //     { id: '5', message: 'Urgent: Client feedback required by EOD.', isRead: false, timestamp: new Date().toISOString() }
  //   ],
  //   sops: [
  //     { id: 'greeting', title: 'Welcome to the System', description: 'This is a greeting message for the user when they log in.', received: false },
  //     { id: 'procedure1', title: 'Password Reset', description: 'Steps for resetting your password securely.', received: false },
  //     { id: 'procedure2', title: 'Contact Support', description: 'Steps to reach out to support if you encounter any issues.', received: false }
  //   ]
  // };

  // // Mark an alert as read
  // markAlertAsRead(alert: any): void {
  //   alert.isRead = true;
  // }

  // // Mark an SOP as received
  // markSopAsReceived(sop: any): void {
  //   sop.received = true;
  // }
  // constructor(public modalRef: MdbModalRef<ModalComponent>) {}
}
