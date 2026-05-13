import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cm-movie-card-rege',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card-rege.html',
  styleUrl: './movie-card-rege.css'
})
export class MovieCardRegeComponent {
  @Input() movie!: any;
  @Input() priority: boolean = false;
  @Output() clickCard = new EventEmitter<void>();

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    return '★'.repeat(fullStars) + (halfStar ? '½' : '');
  }
}
