import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

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
isLoggedInAsLibrarian: boolean = false; 

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private bookService: BookService,
  private authService: AuthenticationService 
) {}

ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.searchQuery = params['query'];
    this.bookService.searchBooks(this.searchQuery).subscribe(results => {
      this.searchResults = results;
    });
  });

  this.isLoggedInAsLibrarian = this.authService.getUserRole() === 'librarian';
}

editBook(id: number): void {
  this.router.navigate(['/edit-book', id]); 
}

removeBook(id: number): void {
  this.bookService.deleteBook(id).subscribe(
    () => {
      this.searchResults = this.searchResults.filter(book => book.id !== id);
    },
    (error) => {
      console.error('Error deleting book:', error);
     
    }
  );
}
}