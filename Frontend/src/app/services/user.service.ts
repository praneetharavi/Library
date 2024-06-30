import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticated = false;
  private role: 'librarian' | 'customer' | null = null;

  private apiUrl = `${environment.apiUrl}/account`;

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
          sessionStorage.setItem('currentUser', JSON.stringify(response));
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
    return JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
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