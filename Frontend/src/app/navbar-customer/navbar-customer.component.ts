import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-navbar-customer',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './navbar-customer.component.html',
  styleUrl: './navbar-customer.component.css'
})
export class NavbarCustomerComponent {
  searchTerm: string = '';
  books: any[] = [];
  searchResults: any[] = [];
  showDropdown: boolean = false;
  searchQuery: string = '';
  isDropdownOpen = false; 
  user : any;

 constructor(private router: Router, private bookService: BookService, private authService : AuthenticationService) { 
  this.user = this.authService.getLoggedInUser();
 }

 ngOnInit(): void {
  this.getAllBooks();
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
    const navigationExtras: NavigationExtras = {
      skipLocationChange: false, // Ensure this is set to false to trigger a reload
      replaceUrl: true // Replace current URL in history with new one
    };

    this.router.navigate(['/book', book.id], navigationExtras)
    .then(() => {
      this.showDropdown = false;
      this.searchTerm = '';
      this.searchResults = [];
    });
  }

  submitSearch(event: Event) {
    event.preventDefault(); // Prevent the default form submission
    this.onSearch();
  }

  onSearch() {
    this.showDropdown = false;
    this.router.navigate(['/search-results'], { queryParams: { query: this.searchTerm } });
  }


  goToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }

  goToCart(): void {
    this.router.navigate(['/cart'])
  }

  logout(){
    this.authService.logout();
  }

  toggleDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  goToPastCheckouts() {
    this.router.navigate(['/past-checkouts']);
  }
}