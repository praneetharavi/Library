import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private apiUrl = 'http://localhost:5120/api/cart';


  constructor(private http: HttpClient) { }

  addToCart(userId: string, bookId: number): Observable<any> {
    const request: any = {
      userId: userId,
      bookId: bookId
    };
    return this.http.post<any>(`${this.apiUrl}/addtocart`, request);
  }

  addToWishlist(userId: string, bookId: number): Observable<any> {
    const request: any = {
      userId: userId,
      bookId: bookId
    };

    return this.http.post(`${this.apiUrl}/addtowishlist`, request);
  }

  moveToCart(userId: string, bookId: number): Observable<any> {
    const request: any = {
      userId: userId,
      bookId: bookId
    };
    return this.http.post<any>(`${this.apiUrl}/MovetoCart`,  request);
  }

  removeFromWishlist(userId: string, bookId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/RemoveFromWishlist`, { userId, bookId });
  }

  removeFromCart(userId: string, bookId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/RemoveFromCart`, { userId, bookId });
  }

  getAllBooksFromWishlist(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAllBooksFromWishlist/${userId}`);
  }

  getAllBooksFromCart(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAllBooksFromCart/${userId}`);
  }
  checkBookInWishlist(userId: string, bookId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/checkInWishlist/${userId}/${bookId}`);
  }

  checkBookInCart(userId: string, bookId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/checkInCart/${userId}/${bookId}`);
  }
}


