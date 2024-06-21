import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,CommonModule, RouterLink, RouterLinkActive,FormsModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
  showLoginForm : boolean = true;
  signupTextType: boolean = false;
  loginTextType: boolean = false;
  confirmTextType: boolean = false;
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.createForm();
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
      signupConfirmPassword: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      // Handle form submission
      console.log('Form Submitted!', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  onSignup() {
    if (this.signupForm.valid) {
      // Handle form submission
      console.log('Signup Form Submitted!', this.signupForm.value);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
  toggleForms() {
    this.showLoginForm = !this.showLoginForm;
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
