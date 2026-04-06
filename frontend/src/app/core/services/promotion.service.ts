import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion } from '../models/promotion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  checkCode(code: string): Observable<Promotion> {
    return this.http.post<Promotion>(`${this.apiUrl}/promotions/check`, { code });
  }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.apiUrl}/promotions`);
  }

  createPromotion(data: any): Observable<Promotion> {
    return this.http.post<Promotion>(`${this.apiUrl}/promotions`, data);
  }

  updatePromotion(id: number, data: any): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.apiUrl}/promotions/${id}`, data);
  }

  deletePromotion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/promotions/${id}`);
  }
}
