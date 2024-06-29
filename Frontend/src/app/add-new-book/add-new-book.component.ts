import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-add-new-book',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './add-new-book.component.html',
  styleUrl: './add-new-book.component.css'
})
export class AddNewBookComponent {
  addBookForm: FormGroup;
  coverImageUrl: string ='';
  successMessage: string | null = null;
  errorMessage: string | null =null;

  constructor(private fb: FormBuilder, private bookService : BookService) {
    this.addBookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      author: ['', Validators.required],
      coverImage: [null],
      publisher: ['', Validators.required],
      publicationDate: ['', Validators.required],
      category: ['', Validators.required],
      isbn: ['', Validators.required],
      pageCount: ['', Validators.required],
    });
  }



  onSubmit(): void {
    if (this.addBookForm.valid) {
      const book = {
        title: this.addBookForm.get('title')!.value,
        description: this.addBookForm.get('description')!.value,
        author: this.addBookForm.get('author')!.value,
        coverImage: this.addBookForm.get('coverImage')!.value,
        publisher: this.addBookForm.get('publisher')!.value,
        publicationDate: this.addBookForm.get('publicationDate')!.value,
        category: this.addBookForm.get('category')!.value,
        isbn: this.addBookForm.get('isbn')!.value,
        pageCount: this.addBookForm.get('pageCount')!.value
      };

      this.bookService.createBook(book).subscribe(
        (response) => {
          this.successMessage = `Book "${response.title}" successfully added.`;
          this.addBookForm.reset();
          this.bookService.triggerRefreshBooks(); 
          setTimeout(() => {
            this.successMessage = '';
          }, 3000)
        },
        (error) => {
          console.error('Error adding book:', error);
          this.errorMessage = error.description || 'Failed to add new Book! Try again later.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      );
    }
  }
}

