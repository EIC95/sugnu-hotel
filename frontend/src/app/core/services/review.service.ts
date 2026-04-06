import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  submitReview(reviewData: any): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews`, reviewData);
  }
}
