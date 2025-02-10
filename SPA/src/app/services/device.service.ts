import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceActivity } from './device-activity.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:44372/api/device';

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
