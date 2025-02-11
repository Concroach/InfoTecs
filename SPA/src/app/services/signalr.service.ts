import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { DeviceActivity } from './device-activity.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  constructor() {}

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:8080/devicehub`) // Внешний URL
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch((err) => console.error('SignalR connection error:', err));

    // Подписываемся на событие создания новой записи
    this.hubConnection.on('ReceiveActivityUpdate', (activity: DeviceActivity) => {
      console.log('Received activity update:', activity);
      if (this['notifyActivityUpdate']) {
        this['notifyActivityUpdate'](activity);
      }
    });

    // Подписываемся на событие чистки записей
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
