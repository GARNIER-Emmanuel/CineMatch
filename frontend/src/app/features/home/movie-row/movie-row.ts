import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieSkeletonComponent } from '../movie-skeleton/movie-skeleton';

export interface MovieItem {
  id: number;
  title: string;
  poster: string;
  rating?: string;
}

@Component({
  selector: 'cm-movie-row',
  standalone: true,
  imports: [CommonModule, MovieSkeletonComponent],
  template: `
    <div class="row" [class.grid-mode]="isGrid">
      <h2 class="row-title" *ngIf="title">{{ title }}</h2>
      <div class="row-posters">
        @if (loading) {
          @for (i of [1,2,3,4,5,6,7,8,9,10,11,12]; track i) {
            <cm-movie-skeleton></cm-movie-skeleton>
          }
        } @else {
          @for (movie of movies; track movie.id) {
            <div class="movie-card">
              <img [src]="movie.poster" [alt]="movie.title">
              <div class="movie-info">
                <h3>{{ movie.title }}</h3>
                <span class="rating" *ngIf="movie.rating">⭐ {{ movie.rating }}</span>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .row {
      margin: 30px 0;
      padding-left: var(--container-padding);
    }

    .row-title {
      font-size: 1.4rem;
      color: #e5e5e5;
      margin-bottom: 15px;
      transition: color 0.3s;
    }

    .row:hover .row-title {
      color: #fff;
    }

    .row-posters {
      display: flex;
      gap: 15px;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 20px 0;
      scrollbar-width: none; /* Firefox */
    }

    /* Mode Grille */
    .row.grid-mode {
      padding-right: var(--container-padding);
    }

    .row.grid-mode .row-posters {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      overflow-x: visible;
      gap: 25px;
    }

    .row-posters::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }

    .movie-card {
      flex: 0 0 auto;
      width: 200px;
      position: relative;
      cursor: pointer;
      transition: transform 0.4s ease;
      border-radius: 4px;
      overflow: hidden;
    }

    .row.grid-mode .movie-card {
      width: 100%; /* S'adapte à la cellule de la grille */
    }

    .movie-card:hover {
      transform: scale(1.08);
      z-index: 100;
    }

    .movie-card img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      display: block;
    }

    .movie-info {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
      padding: 20px 10px 10px;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .movie-card:hover .movie-info {
      opacity: 1;
    }

    .movie-info h3 {
      font-size: 0.9rem;
      color: #fff;
      margin-bottom: 5px;
    }

    .rating {
      font-size: 0.8rem;
      color: #46d369;
      font-weight: 700;
    }

    @media (max-width: 600px) {
      .movie-card {
        width: 150px;
      }
      .row.grid-mode .row-posters {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }
      .movie-card img {
        height: 225px;
      }
    }
  `]
})
export class MovieRowComponent {
  @Input() title: string = '';
  @Input() movies: MovieItem[] = [];
  @Input() loading: boolean = false;
  @Input() isGrid: boolean = false;
}
