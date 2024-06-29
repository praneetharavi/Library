import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  @ViewChild('wishlistModal') wishlistModal!: ElementRef;
  wishlistBooks: any[] = []; 
  userId : any;
  selectedBook: any;

  constructor(private cartService: CartService, private authService : AuthenticationService,private router :Router) {
    const user = this.authService.getLoggedInUser();
    this.userId = user.userId;
   }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.cartService.getAllBooksFromWishlist(this.userId)
      .subscribe(
        response => {
          this.wishlistBooks = response.books; // Adjust property based on API response structure
        },
        error => {
          console.error('Error loading wishlist:', error);
        }
      );
  }

  removeFromWishlist(bookId: number): void {
    this.cartService.removeFromWishlist(this.userId, bookId)
      .subscribe(
        response => {
          console.log('Book removed from wishlist:', response.message);
          this.loadWishlist(); // Refresh wishlist after removal
        },
        error => {
          console.error('Error removing book from wishlist:', error);
        }
      );
    }

      MoveToCart(book : any){
        this.cartService.moveToCart(this.userId, book.id).subscribe((response)=>{
          this.loadWishlist();
          this.selectedBook = book;
          this.showModal(this.wishlistModal)
        })
      }
      GotoHome(){
        this.router.navigate(['/customerdashboard'])
      }
      GoToCart(){
        this.router.navigate(['/cart'])
      }
      private showModal(modalElement: ElementRef): void {
        modalElement.nativeElement.classList.add('show');
        modalElement.nativeElement.style.display = 'block';
        document.body.classList.add('modal-open');
      }
    
      closeModal(): void {
        this.wishlistModal.nativeElement.classList.remove('show');
        this.wishlistModal.nativeElement.style.display = 'none';
        document.body.classList.remove('modal-open');
      }
  }

