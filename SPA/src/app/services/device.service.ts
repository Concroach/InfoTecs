import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceActivity } from './device-activity.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = environment.apiUrl + '/api/device';

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

  cleanupOldRecords(threshold: Date): Observable<void> {
    const params = { threshold: threshold.toISOString() };
    return this.http.delete<void>(`${this.apiUrl}/cleanup`, { params });
  }
}
