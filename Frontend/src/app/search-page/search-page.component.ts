import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('removeBookModal') removeBookModal!: ElementRef;
  searchQuery: string = '';
  searchResults: any[] = [];
isLoggedInAsLibrarian: boolean = false; 
selectedBook: any;
books : any[] =[];

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private bookService: BookService,
  private authService: AuthenticationService 
) {}

ngOnInit(): void {
  this.getAllBooks();
  this.getSearchResults();
  this.isLoggedInAsLibrarian = this.authService.getUserRole() === 'librarian';
}

getSearchResults(){
  this.route.queryParams.subscribe(params => {
    this.searchQuery = params['query'];
    this.bookService.searchBooks(this.searchQuery).subscribe(results => {
      this.searchResults = results;
    });
  });

}
editBook(id: number): void {
  this.router.navigate(['/edit-book', id]); 
}


removeBook(bookId: string) {
  this.selectedBook = this.searchResults.find(book => book.id === bookId);
 this.showModal(this.removeBookModal);
}

confirmRemoveBook() {
  this.bookService.deleteBook(this.selectedBook.id).subscribe(
    () => {
      this.closeModal();
      this.getAllBooks(); // Refresh the list of books
    },
    error => {
      console.error('Error deleting book:', error);
    }
  );
}
getAllBooks(){
  this.bookService.getAllBooks().subscribe((response) => {
    this.books = response;
   this.getSearchResults();
  });
}
closeModal(): void {
  this.removeBookModal.nativeElement.classList.remove('show');
  this.removeBookModal.nativeElement.style.display = 'none';
  document.body.classList.remove('modal-open');
}

private showModal(modalElement: ElementRef): void {
  modalElement.nativeElement.classList.add('show');
  modalElement.nativeElement.style.display = 'block';
  document.body.classList.add('modal-open');
}

}
