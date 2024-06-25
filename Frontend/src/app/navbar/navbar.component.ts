import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule,CommonModule,LoginModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

constructor(private authService : AuthenticationService,private loginModal : LoginModalComponent){

}

openLoginModal(){
  this.loginModal.open();
}

loginAsCustomer() {
  this.authService.login('customer');
}

loginAsLibrarian() {
  this.authService.login('librarian');
}
}
