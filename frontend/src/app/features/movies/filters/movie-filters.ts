import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Genre {
  id: string;
  name: string;
}

@Component({
  selector: 'cm-movie-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-container">
      <div class="filter-section">
        <h3 class="filter-label">Genres</h3>
        <div class="genres-list">
          @for (genre of genres; track genre.id) {
            <button 
              class="genre-btn" 
              [class.active]="selectedGenreId === genre.id"
              [attr.data-test]="'genre-' + genre.id"
              (click)="selectGenre(genre.id)">
              {{ genre.name }}
            </button>
          }
        </div>
      </div>

      <div class="filter-section">
        <h3 class="filter-label">Durée maximale : {{ maxDuration }} min</h3>
        <input 
          type="range" 
          min="30" 
          max="240" 
          step="15" 
          [(ngModel)]="maxDuration"
          (input)="onDurationChange($event)"
          class="slider"
          data-test="duration-slider">
      </div>

      <div class="filter-section">
        <h3 class="filter-label">Note minimale : {{ minRating }} / 10</h3>
        <input 
          type="range" 
          min="0" 
          max="10" 
          step="1" 
          [(ngModel)]="minRating"
          (input)="onRatingChange($event)"
          class="slider"
          data-test="rating-input">
      </div>
    </div>
  `,
  styles: [`
    .filters-container {
      margin: 20px 0;
      padding: 0 var(--container-padding);
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .filter-label {
      font-size: 1rem;
      color: var(--text-secondary);
      margin-bottom: 15px;
    }

    .genres-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .genre-btn {
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .genre-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .genre-btn.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      font-weight: 700;
    }

    .slider {
      width: 100%;
      max-width: 300px;
      height: 4px;
      background: #333;
      border-radius: 2px;
      outline: none;
      -webkit-appearance: none;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--primary-color);
      cursor: pointer;
    }
  `]
})
export class MovieFiltersComponent {
  @Output() genreChange = new EventEmitter<string | null>();
  @Output() durationChange = new EventEmitter<number>();
  @Output() ratingChange = new EventEmitter<number>();

  selectedGenreId: string | null = null;
  maxDuration: number = 240;
  minRating: number = 6;

  genres: Genre[] = [
    { id: '28', name: 'Action' },
    { id: '12', name: 'Aventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comédie' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentaire' },
    { id: '18', name: 'Drame' },
    { id: '14', name: 'Fantastique' },
    { id: '27', name: 'Horreur' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Science-Fiction' },
    { id: '53', name: 'Thriller' }
  ];

  selectGenre(id: string): void {
    if (this.selectedGenreId === id) {
      this.selectedGenreId = null;
    } else {
      this.selectedGenreId = id;
    }
    this.genreChange.emit(this.selectedGenreId);
  }

  onDurationChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.durationChange.emit(parseInt(value, 10));
  }

  onRatingChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.ratingChange.emit(parseInt(value, 10));
  }
}
