import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { DeviceActivity } from '../../services/device-activity.model';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.less']
})
export class DeviceListComponent implements OnInit, OnDestroy {
  devices: DeviceActivity[] = [];

  constructor(
    private deviceService: DeviceService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    // Загрузка начальных данных
    this.loadAllDevices();

    // Инициализация SignalR
    this.signalRService.startConnection();

    // Подписываемся на обновления от SignalR
    this.signalRService['notifyActivityUpdate'] = (activity: DeviceActivity) => {
      this.devices.push(activity); // Добавляем новую активность в список
      console.log('Activity added dynamically:', activity);
    };
  }

  ngOnDestroy(): void {
    // Закрываем соединение при уничтожении компонента
    this.signalRService.stopConnection();
  }

  loadAllDevices(): void {
    this.deviceService.getAllActivities().subscribe(
      (data) => {
        this.devices = data;
      },
      (error) => {
        console.error('Failed to load all devices:', error);
      }
    );
  }
}
