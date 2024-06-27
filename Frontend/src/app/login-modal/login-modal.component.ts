import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { HomeComponent } from '../home/home.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,CommonModule, RouterLink, RouterLinkActive,FormsModule,ReactiveFormsModule,],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  showLoginForm : boolean = true;
  signupTextType: boolean = false;
  loginTextType: boolean = false;
  confirmTextType: boolean = false;
  loginForm!: FormGroup;
  signupForm!: FormGroup;

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder,private userService: UserService, private router: Router, private authService : AuthenticationService)  {
    this.createForm();
  }

  open() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  close() {
    document.getElementById("closeModalButton")?.click();
  }

  createForm() {
    this.loginForm = this.fb.group({
      loginEmail: ['', [Validators.required, Validators.email]],
      loginPassword: ['', Validators.required]
    });
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      signupEmail: ['', [Validators.required, Validators.email]],
      signupPassword: ['', Validators.required],
      signupConfirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.loginEmail;
      const password = this.loginForm.value.loginPassword;
  
      this.userService.login(email, password).subscribe(
        response => {
          if (response) {
            this.authService.setToken(response.token);
            this.authService.setLoggedInUser(response);
            this.errorMessage = '';
            document.getElementById("closeModalButton")?.click();
       
            if(response.role=='Librarian'){
              this.authService.login('librarian')
              this.router.navigate(['/librariandashboard']);
            }
            else{
             this.authService.login('customer')
             this.router.navigate(['/customerdashboard']);
            }
          }
        },
        error => {
          if (Array.isArray(error.error)) {
            this.errorMessage = error.error.map((err: { description: any; }) => err.description).join(' ');
          } else {
            this.errorMessage = error.error.message || 'Signup failed. Please try again.';
          }
        }
      
      );
    
    } else {
      this.errorMessage = '';
      this.loginForm.markAllAsTouched();
    }
  }
  onSignup(): void {
    if (this.signupForm.valid) {
      const firstName = this.signupForm.value.firstName;
      const lastName = this.signupForm.value.lastName;
      const email = this.signupForm.value.signupEmail;
      const password = this.signupForm.value.signupPassword;
      const confirmPassword = this.signupForm.value.signupConfirmPassword;
      const role = this.signupForm.value.role;

      if (password !== confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      const username = `${firstName}${lastName}`.replace(/\s/g, '');

      const signupData = { username, firstName, lastName, email, password, role };

      this.userService.signup(signupData).subscribe(
        response => {
          this.errorMessage = '';
          this.showLoginForm = true;
          this.signupForm.reset();
          this.loginForm.reset();
          this.router.navigate(['/login']); // Navigate to the login page or dashboard
        },
        error => {
          if (Array.isArray(error.error)) {
            this.errorMessage = error.error.map((err: { description: any; }) => err.description).join(' ');
          } else {
            this.errorMessage = error.error.message || 'Signup failed. Please try again.';
          }
        }
      );
    } else {
      this.signupForm.markAllAsTouched();
      this.errorMessage = '';
    }
  }

  toggleForms() {
    this.showLoginForm = !this.showLoginForm;
    this.resetFormsAndError();
  }

  closeModal() {
    this.showLoginForm = true;
    this.resetFormsAndError();
  }

  resetFormsAndError() {
    this.loginForm.reset();
    this.signupForm.reset();
    this.errorMessage = '';
  }
  
  toggleSignupFieldTextType() {
    this.signupTextType = !this.signupTextType;
  }
  toggleConfirmFieldTextType() {
    this.confirmTextType = !this.confirmTextType;
  }
  toggleloginFieldTextType() {
    this.loginTextType = !this.loginTextType;
  }


  
}

