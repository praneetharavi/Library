import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-librarian',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './navbar-librarian.component.html',
  styleUrl: './navbar-librarian.component.css'
})
export class NavbarLibrarianComponent {
  refreshBooksSubscription! : Subscription;
  
  user : any;
  isDropdownOpen = false; 
  searchTerm: string = '';
  books: any[] = [];
  searchResults: any[] = [];
  showDropdown: boolean = false;
  searchQuery: string = '';


 

 constructor(private router: Router, private bookService: BookService, private authService : AuthenticationService) { 
  this.user = this.authService.getLoggedInUser();
 }

 ngOnInit(): void {
  this.getAllBooks();
  this.refreshBooksSubscription = this.bookService.refreshBooks$.subscribe(() => {
    this.getAllBooks();
  });
}

ngOnDestroy(): void {
  this.refreshBooksSubscription.unsubscribe();
}
  logout(){
    this.authService.logout();
  }

  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  getAllBooks() {
    this.bookService.getAllBooks().subscribe(
      (data: any[]) => {
        this.books = data;
      },
      error => {
        console.error('Error fetching books:', error);
      }
    );
  }
    searchBooks() {
      if (this.searchTerm.trim() !== '') {
        this.searchResults = this.books.filter(book =>
          book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.showDropdown = true;
      } else {
        this.showDropdown = false;
        this.searchResults = [];
      }
    }
  

  
    navigateToBookDetails(book: any) {
      this.router.navigate(['/book', book.id]); // Assuming each book has an 'id'
      this.showDropdown = false;
      this.searchTerm = '';
      this.searchResults = [];
    }
  
    submitSearch(event: Event) {
      event.preventDefault(); // Prevent the default form submission
      this.onSearch();
    }
  
    onSearch() {
      this.showDropdown = false;
      this.router.navigate(['/search-results'], { queryParams: { query: this.searchTerm } });
    }
  
}
