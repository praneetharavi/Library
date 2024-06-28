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

}
