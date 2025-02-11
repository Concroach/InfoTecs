import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { SignalRService } from '../../services/signalr.service';
import { DeviceActivity } from '../../services/device-activity.model';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.less']
})
export class DeviceListComponent implements OnInit, OnDestroy {
  devices: DeviceActivity[] = [];
  selectedDeviceId: string | null = null;
  selectedDeviceData: DeviceActivity[] = [];
  cleanupThreshold: string = ''; // Тип должен быть string

  constructor(
    private deviceService: DeviceService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.loadAllDevices();
    this.signalRService.startConnection();

    // Подписываемся на обновления от SignalR
    this.signalRService['notifyActivityUpdate'] = (activity: DeviceActivity) => {
      this.devices.push(activity);
      console.log('Activity added dynamically:', activity);
    };

    // Подписываемся на уведомления о чистке записей
    this.signalRService['notifyCleanup'] = () => {
      this.loadAllDevices();
      console.log('Old records cleaned up');
    };
  }

  ngOnDestroy(): void {
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

  cleanupOldRecords(): void {
    if (!this.cleanupThreshold) {
      alert('Please enter a valid date.');
      return;
    }

    // Преобразуем строку в объект Date перед отправкой на backend
    const thresholdDate = new Date(this.cleanupThreshold);

    this.deviceService.cleanupOldRecords(thresholdDate).subscribe(
      () => {
        console.log('Old records deleted successfully');
        this.cleanupThreshold = ''; // Очищаем поле ввода
      },
      (error) => {
        console.error('Failed to delete old records:', error);
      }
    );
  }
}
