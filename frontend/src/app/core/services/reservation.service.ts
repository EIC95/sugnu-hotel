import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`);
  }

  getReservation(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/reservations/${id}`);
  }

  createReservation(reservationData: any): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/reservations`, reservationData);
  }

  updateReservation(id: number, reservationData: any): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/reservations/${id}`, reservationData);
  }

  cancelReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reservations/${id}`);
  }

  checkIn(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservations/${id}/checkin`, {});
  }

  checkOut(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservations/${id}/checkout`, {});
  }
}
