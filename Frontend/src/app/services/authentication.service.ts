import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isAuthenticated = false;
  private userRole: 'customer' | 'librarian' | null = null;
  private tokenKey = 'authToken';
  private loggedInUser: any;
  
  constructor() {

  }

  setLoggedInUser(user: any): void {
    this.loggedInUser = user;
  }

  getLoggedInUser(): any {
    return this.loggedInUser;
  }




  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
  login(role: 'customer' | 'librarian') {
    this.isAuthenticated = true;
    this.userRole = role;
  }

  logout() {
    this.isAuthenticated = false;
    this.userRole = null;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUserRole(): 'customer' | 'librarian' | null {
    return this.userRole;
  }
}