import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services`);
  }

  createService(data: any): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}/services`, data);
  }

  updateService(id: number, data: any): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/services/${id}`, data);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/services/${id}`);
  }
}
