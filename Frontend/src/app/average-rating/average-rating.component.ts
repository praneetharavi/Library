import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-average-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './average-rating.component.html',
  styleUrl: './average-rating.component.css'
})
export class AverageRatingComponent {

  @Input() averageRating: number = 0;
  maxRating: number = 5; 
  starList: boolean[] = [];

  ngOnChanges() {
    this.starList = [];
    const roundedRating = Math.ceil(this.averageRating); 
    for (let i = 0; i < this.maxRating; i++) {
      if (i < roundedRating) {
        this.starList.push(true); 
      } else {
        this.starList.push(false); 
      }
    }
  }
}
