import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AverageRatingComponent } from '../average-rating/average-rating.component';
import { AuthenticationService } from '../services/authentication.service';
import { CartService } from '../services/cart.service';
import { ReviewService } from '../services/review.service';

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
  rating : any;
  userId: any;
  isInWishlist: boolean = false;
  isInCart: boolean = false;
  bookId : any;
  reviews: any[] = [];
  newReview: any = { rating: 0, reviewText: '' };

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private authService: AuthenticationService,
    private cartService: CartService,
    private router : Router,
    private reviewService : ReviewService
  ) {
    const user = this.authService.getLoggedInUser();
    this.userId = user.userId;
  
  }


 ngOnInit(): void {
    this.route.params.subscribe(params => {
      const bookId = +params['id'];
      if (bookId) {
        this.bookId = bookId;
        this.bookService.getBookById(+bookId).subscribe((book) => {
          this.book = book;
          this.book.averageRating = this.book.averageRating.toFixed(1);
          this.checkBookStatus();
          this.getReviews(bookId);
        }
        );
      }
    });
  }

  getReviews(bookId: any): void {
    this.reviewService.getReviewsByBookId(bookId).subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  submitReview(): void {
    const review = {
      userId: this.userId,
      bookId: this.book.id,
      rating: this.newReview.rating,
      reviewText: this.newReview.reviewText
    };

    this.reviewService.addReview(review).subscribe(newReview => {
      this.reviews.unshift(newReview);
      this.newReview = { rating: 0, reviewText: '' };
    });
  }
  GotoHome(){
    this.router.navigate(['/customerdashboard'])
  }

  setRating(rating: number): void {
    this.newReview.rating = rating;
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

  closeModalWishlist(): void {
    this.wishlistModal.nativeElement.classList.remove('show');
    this.wishlistModal.nativeElement.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
  closeModalCart(): void {
    this.cartModal.nativeElement.classList.remove('show');
    this.cartModal.nativeElement.style.display = 'none';
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

