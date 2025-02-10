import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceActivity } from './device-activity.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:8080/api/device';
  constructor(private http: HttpClient) {}

  getAllActivities(): Observable<DeviceActivity[]> {
    return this.http.get<DeviceActivity[]>(`${this.apiUrl}/all`);
  }

  getDeviceById(deviceId: string): Observable<DeviceActivity[]> {
    return this.http.get<DeviceActivity[]>(`${this.apiUrl}/${deviceId}`);
  }

  downloadBackup(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/backup`, { responseType: 'blob' });
  }
}
