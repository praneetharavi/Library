import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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
      console.log(this.addBookForm.value);
      // Handle form submission
    }
  }
}

