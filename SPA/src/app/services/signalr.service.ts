import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  constructor() {}

  // Инициализация соединения с SignalR
  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://api:44372/devicehub') // Адрес SignalR Hub внутри Docker-сети
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch((err: Error) => console.error('SignalR connection error:', err));

    // Подписываемся на события от сервера
    this.hubConnection.on('ReceiveActivityUpdate', (activity: any) => {
      console.log('Received activity update:', activity);
      this.notifyActivityUpdate(activity); // Вызываем метод для обработки обновления
    });
  }

  // Метод для уведомления компонентов об обновлении
  notifyActivityUpdate(activity: any): void {
    // Реализуйте логику уведомления (например, через Subject или EventEmitter)
  }

  // Закрытие соединения
  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
