import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {
  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(private route: ActivatedRoute, private bookService: BookService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'];
      this.bookService.searchBooks(this.searchQuery).subscribe(results => {
        this.searchResults = results;
      });
    });
  }
}