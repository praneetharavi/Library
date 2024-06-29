import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BorrowService } from '../services/borrow.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  @ViewChild('checkoutModal') checkoutModal!: ElementRef;
  cartBooks: any[] = []; 
  userId : any;
  selectedBook: any;
  errorMessage: string = '';

  constructor(private cartService: CartService, private authService : AuthenticationService
    ,private router : Router, private borrowService : BorrowService
  ) {
    const user = this.authService.getLoggedInUser();
    this.userId = user.userId;
   }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getAllBooksFromCart(this.userId)
      .subscribe(
        response => {
          this.cartBooks = response.books;
        },
        error => {
          console.error('Error loading cart:', error);
        }
      );
  }

  removeFromCart(bookId: number): void {
    this.cartService.removeFromCart(this.userId, bookId)
      .subscribe(
        response => {
          console.log('Book removed from cart:', response.message);
          this.loadCart(); 
          if(this.areAllBooksAvailable()){
            this.errorMessage = '';
          }
        },
        error => {
          console.error('Error removing book from cart:', error);
        }
      );
  }
  checkoutBook(book: any): void {
    this.selectedBook = book;
    this.borrowService.Checkout(this.userId, book.id).subscribe((response) => {
      this.showModal(this.checkoutModal);
      this.loadCart();
    });
  }

  navigateToPastCheckouts(): void {
    this.closeModal();
    this.router.navigate(['/past-checkouts']);
  }
  private areAllBooksAvailable(): boolean {
    return this.cartBooks.every(book => book.availability > 0);
  }

  checkoutAll(): void {
    if (this.areAllBooksAvailable()) {
      const bookIds = this.cartBooks.map(book => book.id);
      this.borrowService.multipleCheckout(this.userId, bookIds).subscribe(
        response => {
          this.loadCart();
        },
        error => {
          console.error('Failed to checkout all books', error);
        }
      );
    } else {
      this.errorMessage = 'Some of the items in your cart are unavailable.';
    }
  }

  private showModal(modalElement: ElementRef): void {
    modalElement.nativeElement.classList.add('show');
    modalElement.nativeElement.style.display = 'block';
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.checkoutModal.nativeElement.classList.remove('show');
    this.checkoutModal.nativeElement.style.display = 'none';
    document.body.classList.remove('modal-open');
  }

  GotoHome(){
    this.router.navigate(['/customerdashboard'])
  }
}


