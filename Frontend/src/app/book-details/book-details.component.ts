import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AverageRatingComponent } from '../average-rating/average-rating.component';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule,FormsModule,AverageRatingComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  book: any ;
  rating : any;

  constructor(private route: ActivatedRoute, private bookService: BookService) { }

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.bookService.getBookById(+bookId).subscribe(book => {
        this.book = book;
        this.rating =   this.book.averageRating.toFixed(1);
      });
  }
}
}
