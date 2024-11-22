import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any>;
  public messages: Subject<string>;

  constructor() {
    this.messages = new Subject<string>();
  }

  public connect(url: string): void {
    this.socket$ = webSocket(url);

    this.socket$.subscribe(
      (message) => this.messages.next(message), // Emit incoming messages
      (err) => console.error(err),              // Handle errors
      () => console.warn('Completed!')           // Handle completion
    );
  }

  public send(message: string): void {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }

  public disconnect(): void {
    if (this.socket$) {
      this.socket$.complete(); // Close the connection
    }
  }
}