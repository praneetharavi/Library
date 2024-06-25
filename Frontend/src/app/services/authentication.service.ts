import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isAuthenticated = false;
  private userRole: 'customer' | 'librarian' | null = null;

  constructor() {

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