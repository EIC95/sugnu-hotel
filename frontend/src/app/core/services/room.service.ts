import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';
import { RoomType } from '../models/room-type.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`);
  }

  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/rooms/${id}`);
  }

  getAvailableRooms(filters: any): Observable<Room[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    });
    return this.http.get<Room[]>(`${this.apiUrl}/rooms/available`, { params });
  }

  getRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${this.apiUrl}/room-types`);
  }

  createRoom(roomData: any): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/rooms`, roomData);
  }

  updateRoom(id: number, roomData: any): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/rooms/${id}`, roomData);
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rooms/${id}`);
  }

  uploadRoomImages(roomId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/rooms/${roomId}/images`, formData);
  }

  setMainImage(roomId: number, imageId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/rooms/${roomId}/images/${imageId}/main`, {});
  }

  deleteImage(roomId: number, imageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rooms/${roomId}/images/${imageId}`);
  }
}
