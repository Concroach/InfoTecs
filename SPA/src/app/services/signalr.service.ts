import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { DeviceActivity } from './device-activity.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  private url = environment.apiUrl + `/devicehub`

  constructor() {}

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch((err: Error) => console.error('SignalR connection error:', err));

    this.hubConnection.on('ReceiveActivityUpdate', (activity: DeviceActivity) => {
      console.log('Received activity update:', activity);
      if (this['notifyActivityUpdate']) {
        this['notifyActivityUpdate'](activity);
      }
    });

    this.hubConnection.on('ReceiveCleanupNotification', () => {
      console.log('Received cleanup notification');
      if (this['notifyCleanup']) {
        this['notifyCleanup']();
      }
    });
  }

  notifyActivityUpdate: ((activity: DeviceActivity) => void) | undefined;
  notifyCleanup: (() => void) | undefined;

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
