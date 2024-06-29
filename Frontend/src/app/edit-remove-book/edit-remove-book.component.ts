import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-remove-book',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './edit-remove-book.component.html',
  styleUrl: './edit-remove-book.component.css'
})
export class EditRemoveBookComponent {
  searchTerm: string = '';
  books: any[] = [];
  searchResults: any[] = [];
  showDropdown: boolean = false;
  book: any = {
    title: '',
    author: '',
    description: '',
    coverImage: '',
    publisher: '',
    publicationDate: '',
    category: '',
    isbn: '',
    pageCount: 0,
    availability: 0
  };
  successMessage = '';
  errorMessage = '';

  constructor(private bookService: BookService) {}

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

  populateEditForm(book: any) {
    this.book = book;
    this.showDropdown = false;
  }

  onSubmit() {
    this.bookService.updateBook(this.book.id, this.book).subscribe(
      response => {
        this.successMessage = `Book "${response.title}" successfully Edited.`;
        this.book  = {
          title: '',
          author: '',
          description: '',
          coverImage: '',
          publisher: '',
          publicationDate: '',
          category: '',
          isbn: '',
          pageCount: 0,
          availability: 0
        };
          this.bookService.triggerRefreshBooks(); 
          this.searchTerm = '';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000)
      },
      error => {
        this.errorMessage = error.description || 'Failed to Edit Book! Try again later.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    );
  }

  removeBook() {
    this.bookService.deleteBook(this.book.id).subscribe(
      (response) => {
        this.successMessage = `Book "${response.title}" successfully Deleted.`;
        this.book  = {
          title: '',
          author: '',
          description: '',
          coverImage: '',
          publisher: '',
          publicationDate: '',
          category: '',
          isbn: '',
          pageCount: 0,
          availability: 0
        };
          this.bookService.triggerRefreshBooks(); 
          this.searchTerm = '';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000)
      },
      error => {
        this.errorMessage = error.description || 'Failed to Delete Book! Try again later.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    );
  }

  clear(){
    this.searchTerm = '';
    this.book  = {
      title: '',
      author: '',
      description: '',
      coverImage: '',
      publisher: '',
      publicationDate: '',
      category: '',
      isbn: '',
      pageCount: 0,
      availability: 0
    };
  }
}