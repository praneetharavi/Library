import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-all-members',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './all-members.component.html',
  styleUrl: './all-members.component.css'
})
export class AllMembersComponent {
 members : any[] = [];
 errorMessage : string = ''

 constructor(private userService: UserService) { }

 ngOnInit(): void {
   this.loadCustomers();
 }
 loadCustomers() {
  this.userService.getCustomers().subscribe((data : any) => {
        this.members = data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
}
}
