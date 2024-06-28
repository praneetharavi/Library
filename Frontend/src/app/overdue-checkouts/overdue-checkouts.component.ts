import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { BookService } from '../services/book.service';
import { BorrowService } from '../services/borrow.service';

@Component({
  selector: 'app-overdue-checkouts',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './overdue-checkouts.component.html',
  styleUrl: './overdue-checkouts.component.css'
})
export class OverdueCheckoutsComponent {

  count : number = 10;
  overdueCheckouts : any[] =[];

  constructor(private authService : AuthenticationService, private borrowService : BorrowService,private bookService :BookService ){
    this.getOverdueCheckouts();
  }

  getOverdueCheckouts(){
    this.borrowService.getOverdueCheckouts(this.count).subscribe((response) =>{
      this.overdueCheckouts = response;
    }); 
  }
  markAsReturned(borrowing: any) {
    this.bookService.markAsReturned(borrowing).subscribe(() => {
      this.getOverdueCheckouts();
    });
  }
}
