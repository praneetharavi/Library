import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-librarian',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './navbar-librarian.component.html',
  styleUrl: './navbar-librarian.component.css'
})
export class NavbarLibrarianComponent {
  user : any;
  isDropdownOpen = false; 

  constructor(private authService : AuthenticationService) {
    this.user=this.authService.getLoggedInUser();
  }
  logout(){
    this.authService.logout();
  }

  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
