import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BookService {


  private refreshBooksSource = new BehaviorSubject<boolean>(true);
  refreshBooks$ = this.refreshBooksSource.asObservable();
  

private apiUrl = `${environment.apiUrl}/book`;

  constructor(private http : HttpClient) { }

  
  getAllBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
  triggerRefreshBooks(): void {
    this.refreshBooksSource.next(true);
  }


  getBestSellers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/GetBestSellers');
  }

  getBookById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  searchBooks(query: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + `/search?query=${query}`);
  }
  createBook(book: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, book, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  updateBook(id: number, book: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  markAsReturned(borrowingId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/return/${borrowingId}`, null);
  }
  
  
}

