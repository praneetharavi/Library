import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddNewBookComponent } from '../add-new-book/add-new-book.component';

@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,AddNewBookComponent],
  templateUrl: './librarian-dashboard.component.html',
  styleUrl: './librarian-dashboard.component.css'
})
export class LibrarianDashboardComponent {
logout(){

}
}
