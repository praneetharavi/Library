import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:5120/api/reviews';
  constructor(private http : HttpClient) { }

  addReview(review: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, review);
  }

  getReviewsByBookId(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/book/${bookId}/reviews`);
  }
}
