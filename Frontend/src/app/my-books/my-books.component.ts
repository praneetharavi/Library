import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BorrowService } from '../services/borrow.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.css'
})
export class MyBooksComponent {

  borrowings: any[] = [];
  user : any;
  userId : any;
  today: Date = new Date();

  constructor(private borrowService: BorrowService, private authService : AuthenticationService,private router : Router) {
    this.user = this.authService.getLoggedInUser();
    if(this.user !== undefined && this.user !== null){
      this.userId = this.user.userId;
    }
   }

  ngOnInit(): void {
    this.getAllBorrowings();
  }

  getAllBorrowings(): void {
    this.borrowService.getBorrowingsByUserId(this.userId).subscribe(
      (data) => {
        this.borrowings = data;
      },
      (error) => {
        console.error('Failed to fetch borrowings', error);
      }
    );
  }

  GotoHome(){
    this.router.navigate(['/customerdashboard'])
  }
}