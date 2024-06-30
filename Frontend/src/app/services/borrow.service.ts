import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {

  private apiUrl = `${environment.apiUrl}/Borrow`;

  constructor(private http : HttpClient) { }

  Checkout(userId: string, bookId: number): Observable<any> {
    const request: any = {
      userId: userId,
      bookId: bookId
    };
    return this.http.post<any>(`${this.apiUrl}/checkout`, request);
  }

  multipleCheckout(userId: string, bookIds: number[]): Observable<any> {
    const request = {
      userId: userId,
      bookIds: bookIds
    };
    return this.http.post<any>(`${this.apiUrl}/checkout/multiple`, request);
  }

  getAllBorrowings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getBorrowing(borrowingId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${borrowingId}`);
  }

  getBorrowingsByUserId(userId : any):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/getAllCheckoutsbyUserId/${userId}`);
  }

  GetBorrowingsByBookId(bookId : any):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/GetBorrowingsByBookId/${bookId}`);
  }
  getOverdueCheckouts(count: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/overdueCheckouts?count=${count}`);
  }

  getLatestCheckouts(count: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/latestCheckouts?count=${count}`);
  }
}
