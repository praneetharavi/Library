import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticated = false;
  private role: 'librarian' | 'customer' | null = null;

  private apiUrl = 'http://localhost:5120/api/account'; // Update with your actual backend URL

  constructor(private http: HttpClient) {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.token) {
      this.isAuthenticated = true;
      this.role = currentUser.role;
    }
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email, password });

    return this.http.post<any>(`${this.apiUrl}/login`, body, { headers }).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
        return response;
      })
    );
  }

  signup(signupData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/register`, signupData, { headers });
  } 
  
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.isAuthenticated = false;
    this.role = null;
  }


  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/getAllCustomers');
  }

  get isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  get userRole(): 'librarian' | 'customer' | null {
    return this.role;
  }
}