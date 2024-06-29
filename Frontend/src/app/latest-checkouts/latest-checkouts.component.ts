import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { BorrowService } from '../services/borrow.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-latest-checkouts',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './latest-checkouts.component.html',
  styleUrl: './latest-checkouts.component.css'
})
export class LatestCheckoutsComponent {

  count : number = 10;
  latestCheckouts : any[] =[];

  constructor(private authService : AuthenticationService, private borrowService : BorrowService,private bookService :BookService ){
    this.getLatestCheckouts();
  }

  getLatestCheckouts(){
    this.borrowService.getLatestCheckouts(this.count).subscribe((response) =>{
      this.latestCheckouts = response;
    }); 
  }
  markAsReturned(borrowing: any) {
    this.bookService.markAsReturned(borrowing.borrowingId).subscribe(() => {
      this.getLatestCheckouts();
    });
  }
}
