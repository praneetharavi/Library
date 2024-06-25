import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthenticationService } from './services/authentication.service';
import { NavbarCustomerComponent } from './navbar-customer/navbar-customer.component';
import { NavbarLibrarianComponent } from './navbar-librarian/navbar-librarian.component';
import { VerticalNavbarComponent } from './vertical-navbar/vertical-navbar.component';
import { LoginModalComponent } from './login-modal/login-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,CommonModule, RouterLink, RouterLinkActive,NavbarComponent,NavbarCustomerComponent,NavbarLibrarianComponent,VerticalNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'Frontend';
  

  constructor(public authService: AuthenticationService)  {

  }

}
