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
  selectedDeviceId: string | null = null;
  selectedDeviceData: DeviceActivity[] = [];

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

  // Метод для загрузки резервной копии
  downloadBackup(): void {
    this.deviceService.downloadBackup().subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Failed to download backup:', error);
      }
    );
  }

  // Метод для выбора устройства
  selectDevice(deviceId: string): void {
    this.selectedDeviceId = deviceId;

    this.deviceService.getDeviceById(deviceId).subscribe(
      (data) => {
        this.selectedDeviceData = data;
      },
      (error) => {
        console.error(`Failed to load device with ID ${deviceId}:`, error);
      }
    );
  }
}
