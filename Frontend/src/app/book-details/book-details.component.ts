import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AverageRatingComponent } from '../average-rating/average-rating.component';
import { AuthenticationService } from '../services/authentication.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, FormsModule, AverageRatingComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent {
  @ViewChild('wishlistModal') wishlistModal!: ElementRef;
  @ViewChild('cartModal') cartModal!: ElementRef;

  book: any;
  rating: any;
  userId: any;
  isInWishlist: boolean = false;
  isInCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private authService: AuthenticationService,
    private cartService: CartService,
    private router : Router
  ) {
    const user = this.authService.getLoggedInUser();
    this.userId = user.userId;
  }

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.bookService.getBookById(+bookId).subscribe((book) => {
        this.book = book;
        this.rating = this.book.averageRating.toFixed(1);
        this.checkBookStatus();
      });
    }
  }

  isCustomer(): boolean {
    return this.authService.getUserRole()?.toLowerCase() === 'customer';
  }

  isBookInWishlist(): boolean {
    return this.isInWishlist;
  }

  isBookInCart(): boolean {
    return this.isInCart;
  }

  checkBookStatus(): void {
    this.cartService.checkBookInWishlist(this.userId, this.book.id).subscribe((response) => {
      this.isInWishlist = response.isInWishlist;
    });
    this.cartService.checkBookInCart(this.userId, this.book.id).subscribe((response) => {
      this.isInCart = response.isInCart;
    });
  }

  addToCart(bookId: number): void {
    this.cartService.addToCart(this.userId, bookId).subscribe((response) => {
      this.checkBookStatus();
      this.showModal(this.cartModal);
    });
  }

  addToWishlist(bookId: number): void {
    this.cartService.addToWishlist(this.userId, bookId).subscribe((response) => {
      this.checkBookStatus();
      this.showModal(this.wishlistModal);
    });
  }

  closeModal(): void {
    this.wishlistModal.nativeElement.classList.remove('show');
    this.wishlistModal.nativeElement.style.display = 'none';
    document.body.classList.remove('modal-open');
  }

  private showModal(modalElement: ElementRef): void {
    modalElement.nativeElement.classList.add('show');
    modalElement.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');
  }


  goToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}