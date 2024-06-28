import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-add-new-book',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-new-book.component.html',
  styleUrl: './add-new-book.component.css'
})
export class AddNewBookComponent {
  addBookForm: FormGroup;
  coverImageUrl: string | ArrayBuffer | null = null;
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = e => this.coverImageUrl = reader.result;
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.addBookForm.valid) {
      const formData = new FormData();
      formData.append('title', this.addBookForm.get('title')!.value);
      formData.append('description', this.addBookForm.get('description')!.value);
      formData.append('author', this.addBookForm.get('author')!.value);
      formData.append('coverImage', this.addBookForm.get('coverImage')!.value);
      formData.append('publisher', this.addBookForm.get('publisher')!.value);
      formData.append('publicationDate', this.addBookForm.get('publicationDate')!.value);
      formData.append('category', this.addBookForm.get('category')!.value);
      formData.append('isbn', this.addBookForm.get('isbn')!.value);
      formData.append('pageCount', this.addBookForm.get('pageCount')!.value);

      this.bookService.createBook(formData).subscribe(
        (response) => {
          this.successMessage = `Book "${response.title}" successfully added.`;
          this.addBookForm.reset();
          this.coverImageUrl = null;
        },
        (error) => {
          console.error('Error adding book:', error);
          this.errorMessage = 'Failed to add new Book! Try again Later'
        }
      );
    }
  }
}

