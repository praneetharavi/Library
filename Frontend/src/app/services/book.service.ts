import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:5120/api/book';

  constructor(private http : HttpClient) { }

  
  getAllBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getBestSellers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/GetBestSellers');
  }

  getBookById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  searchBooks(query: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + `/search?query=${query}`);
  }

  createBook(book: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, book);
  }

  updateBook(id: number, book: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  markAsReturned(borrowing: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/return`, borrowing);
  }
}

