import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { DeviceActivity } from './device-activity.model'
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  constructor() {}

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:8080/devicehub')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch((err) => console.error('SignalR connection error:', err));

    this.hubConnection.on('ReceiveActivityUpdate', (activity: DeviceActivity) => {
      console.log('Received activity update:', activity);
      if (this['notifyActivityUpdate']) {
        this['notifyActivityUpdate'](activity);
      }
    });
  }

  notifyActivityUpdate: ((activity: DeviceActivity) => void) | undefined;

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
