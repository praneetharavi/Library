import { Component } from '@angular/core';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent {

  allbooks :any[] = [];
  allBestSellers : any[] = [];
  filteredBooks : any[] = [];
  filterType = 'title';

  constructor(private bookService : BookService) {
    this.getAllBooks();
    this.getAllBestSellers();
  }


  getAllBooks(){
    this.bookService.getAllBooks().subscribe((response) => {
      this.allbooks = response;
      this.filteredBooks = this.allbooks;
    });
  }

  getAllBestSellers(){
    this.bookService.getBestSellers().subscribe((response) => {
      this.allBestSellers = response;
    });
  }



  ngOnInit(): void {
    this.applyFilter({ target: { value: this.filterType } });
  }

  applyFilter(event: any): void {
    const filterValue = event.target.value;
    this.filterType = filterValue;
    this.applySearch({ target: { value: '' } });
  }

  applySearch(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredBooks = this.allbooks.filter(book => {
      if (this.filterType === 'title') {
        return book.title.toLowerCase().includes(searchValue);
      } else if (this.filterType === 'author') {
        return book.author.toLowerCase().includes(searchValue);
      } else if (this.filterType === 'availability') {
        return book.copiesAvailable > 0;
      }
      return true;
    });
  }
}

