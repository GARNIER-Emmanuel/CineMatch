import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieSkeletonComponent } from '../movie-skeleton/movie-skeleton';

export interface MovieItem {
  id: number;
  title: string;
  poster: string;
  rating: string;
  overview?: string; // Ajout du synopsis
}

@Component({
  selector: 'cm-movie-row',
  standalone: true,
  imports: [CommonModule, MovieSkeletonComponent],
  template: `
    <section class="movie-section" [class.grid-layout]="isGrid">
      <h2 class="section-title" *ngIf="title && !isGrid">{{ title }}</h2>
      
      <div class="movie-container">
        @if (loading) {
          @for (i of [1,2,3,4,5,6]; track i) {
            <cm-movie-skeleton></cm-movie-skeleton>
          }
        } @else {
          @for (movie of movies; track movie.id) {
            <div class="movie-card" (click)="onMovieClick(movie)">
              <img [src]="movie.poster" [alt]="movie.title" loading="lazy">
              <div class="movie-info">
                <span class="rating">★ {{ formatRating(movie.rating) }}</span>
                <h3>{{ movie.title }}</h3>
              </div>
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    .movie-section {
      padding: 20px var(--container-padding);
      overflow: hidden;
    }

    .section-title {
      font-size: 1.4rem;
      margin-bottom: 15px;
      font-weight: 700;
      color: #e5e5e5;
    }

    .movie-container {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 20px;
      scrollbar-width: none; /* Firefox */
    }

    .movie-container::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }

    .movie-card {
      min-width: 200px;
      width: 200px;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .movie-card:hover {
      transform: scale(1.05);
      z-index: 10;
    }

    .movie-card img {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .movie-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 15px 10px;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .movie-card:hover .movie-info {
      opacity: 1;
    }

    .rating {
      color: #46d369;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .movie-info h3 {
      font-size: 0.9rem;
      margin: 5px 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Grid Layout for Search Results */
    .grid-layout .movie-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      overflow-x: visible;
    }

    .grid-layout .movie-card {
      width: 100%;
      min-width: 0;
    }
  `]
})
export class MovieRowComponent {
  @Input() title?: string;
  @Input() movies: MovieItem[] = [];
  @Input() loading = false;
  @Input() isGrid = false;
  
  @Output() movieClick = new EventEmitter<MovieItem>();

  onMovieClick(movie: MovieItem): void {
    this.movieClick.emit(movie);
  }

  formatRating(rating: string): string {
    const val = parseFloat(rating);
    return isNaN(val) ? '0.0' : val.toFixed(1);
  }
}
