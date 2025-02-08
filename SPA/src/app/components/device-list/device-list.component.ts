import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../services/device.service';
import { DeviceActivity } from '../../services/device-activity.model';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.less']
})
export class DeviceListComponent implements OnInit {
  devices: DeviceActivity[] = [];
  selectedDeviceId: string | null = null;
  selectedDeviceData: DeviceActivity[] = [];

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.loadAllDevices();
  }

  loadAllDevices(): void {
    this.deviceService.getAllActivities().subscribe(
      data => {
        this.devices = data;
      },
      error => {
        console.error('Failed to load all devices:', error);
      }
    );
  }

  selectDevice(deviceId: string): void {
    this.selectedDeviceId = deviceId;

    this.deviceService.getDeviceById(deviceId).subscribe(
      data => {
        this.selectedDeviceData = data;
      },
      error => {
        console.error(`Failed to load device with ID ${deviceId}:`, error);
      }
    );
  }

  downloadBackup(): void {
    this.deviceService.downloadBackup().subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Failed to download backup:', error);
      }
    );
  }
}
