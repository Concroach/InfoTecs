import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { DeviceActivity } from './device-activity.model'
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  constructor() {}

  // Инициализация соединения с SignalR
  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://api:8080/api/device/devicehub') // Адрес SignalR Hub внутри Docker-сети
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch((err) => console.error('SignalR connection error:', err));

    // Подписываемся на события от сервера
    this.hubConnection.on('ReceiveActivityUpdate', (activity: DeviceActivity) => {
      console.log('Received activity update:', activity);
      if (this['notifyActivityUpdate']) {
        this['notifyActivityUpdate'](activity); // Вызываем метод для обработки обновления
      }
    });
  }

  // Метод для уведомления компонентов об обновлении
  notifyActivityUpdate: ((activity: DeviceActivity) => void) | undefined;

  // Закрытие соединения
  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
