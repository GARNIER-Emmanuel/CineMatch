import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../../../core/services/movies';

@Component({
  selector: 'cm-director-movies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="director-movies-page">
      <header class="page-header">
        <button class="back-btn" (click)="onBack()">
          <span class="icon">←</span>
          Retour
        </button>
        <h1>Filmographie de {{ directorName }}</h1>
        <p>{{ movies.length }} films trouvés sur TMDB.</p>
      </header>

      <div class="loader-container" *ngIf="loading">
        <div class="cinema-loader"></div>
      </div>

      <div class="movies-grid" *ngIf="!loading">
        @for (movie of movies; track movie.id) {
          <div class="movie-card" (click)="onMovieClick(movie)">
            <div class="card-image">
              <img [src]="movie.poster || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + movie.title" [alt]="movie.title">
              <div class="card-overlay">
                <span class="rating">★ {{ movie.rating }}</span>
              </div>
            </div>
            <div class="card-info">
              <h3>{{ movie.title }}</h3>
              <span class="year">{{ movie.releaseYear }}</span>
            </div>
          </div>
        }
      </div>

      <div class="no-results" *ngIf="!loading && movies.length === 0">
        <p>Aucun film trouvé pour ce réalisateur.</p>
      </div>
    </div>
  `,
  styles: [`
    .director-movies-page {
      padding: 20px 4% 40px;
      min-height: 100vh;
      background: #05080f;
    }

    .page-header {
      margin-bottom: 50px;
    }

    .back-btn {
      background: transparent;
      border: none;
      color: #ffb400;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-weight: 600;
      margin-bottom: 20px;
      padding: 0;
      transition: transform 0.3s;
    }

    .back-btn:hover {
      transform: translateX(-5px);
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-family: 'Playfair Display', serif;
      margin-bottom: 5px;
      color: white;
    }

    .page-header p {
      color: rgba(255, 255, 255, 0.5);
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 30px;
    }

    .movie-card {
      cursor: pointer;
      transition: transform 0.3s;
    }

    .movie-card:hover {
      transform: scale(1.05);
    }

    .card-image {
      position: relative;
      aspect-ratio: 2/3;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 12px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-overlay {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      padding: 4px 8px;
      border-radius: 4px;
      backdrop-filter: blur(4px);
    }

    .rating {
      color: #ffb400;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .card-info h3 {
      font-size: 1rem;
      margin-bottom: 4px;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .year {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
    }

    .loader-container {
      display: flex;
      justify-content: center;
      padding: 100px 0;
    }

    .no-results {
      text-align: center;
      padding: 100px 0;
      color: rgba(255, 255, 255, 0.4);
    }
  `]
})
export class DirectorMoviesComponent implements OnInit {
  @Input() directorId!: number;
  @Input() directorName: string = '';
  @Output() back = new EventEmitter<void>();
  @Output() movieClick = new EventEmitter<any>();

  movies: any[] = [];
  loading = true;

  constructor(
    private moviesService: MoviesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.directorId) {
      this.moviesService.getDirectorMovies(this.directorId).subscribe({
        next: (data) => {
          this.movies = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  onBack() {
    this.back.emit();
  }

  onMovieClick(movie: any) {
    this.movieClick.emit(movie);
  }
}
