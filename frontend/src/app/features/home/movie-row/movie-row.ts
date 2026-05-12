import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MovieItem {
  id: number;
  title: string;
  overview: string;
  poster: string;
  rating: string;
  backdrop?: string | null;
  releaseYear: string;
}

@Component({
  selector: 'cm-movie-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="movie-row-container">
      <h2 class="row-title">{{ title }}</h2>
      
      <div class="row-wrapper">
        <!-- Flèche Gauche -->
        <button class="scroll-btn scroll-left" (click)="scrollLeft()" *ngIf="canScrollLeft">
          ‹
        </button>

        <div class="row-content" #rowContent (scroll)="onScroll()">
          <!-- Skeleton Loading -->
          <ng-container *ngIf="loading">
            <div class="skeleton-card" *ngFor="let i of [1,2,3,4,5,6]"></div>
          </ng-container>

          <!-- Movie List -->
          <ng-container *ngIf="!loading">
            <div 
              class="movie-card" 
              *ngFor="let movie of movies"
              (click)="onMovieClick(movie)">
              <img [src]="movie.poster" [alt]="movie.title" title="" loading="lazy">
              <div class="card-overlay">
                <span class="rating">★ {{ movie.rating }}</span>
                <span class="movie-title">{{ movie.title }}</span>
              </div>
            </div>
          </ng-container>
        </div>

        <!-- Flèche Droite -->
        <button class="scroll-btn scroll-right" (click)="scrollRight()" *ngIf="canScrollRight">
          ›
        </button>
      </div>
    </section>
  `,
  styles: [`
    .movie-row-container {
      margin-bottom: 45px;
      padding: 0 4%;
    }

    .row-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      font-weight: 800;
      color: white;
      margin-bottom: 20px;
      letter-spacing: -0.5px;
    }

    .row-wrapper {
      position: relative;
    }

    .scroll-btn {
      position: absolute;
      top: 0;
      height: 100%;
      width: 50px;
      z-index: 20;
      border: none;
      cursor: pointer;
      font-size: 2.5rem;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      opacity: 0;
    }

    .row-wrapper:hover .scroll-btn {
      opacity: 1;
    }

    .scroll-left {
      left: -10px;
      background: linear-gradient(to right, rgba(5, 8, 15, 0.9), transparent);
      padding-right: 15px;
    }

    .scroll-right {
      right: -10px;
      background: linear-gradient(to left, rgba(5, 8, 15, 0.9), transparent);
      padding-left: 15px;
    }

    .scroll-btn:hover {
      color: #ffb400;
    }

    .row-content {
      display: flex;
      gap: 15px;
      overflow-x: auto;
      padding-bottom: 20px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      scroll-behavior: smooth;
    }

    .row-content::-webkit-scrollbar {
      display: none;
    }

    .movie-card {
      position: relative;
      flex: 0 0 180px;
      aspect-ratio: 2/3;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      background: #0a0e1a;
      border: 1px solid rgba(255, 180, 0, 0.05);
    }

    .movie-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .movie-card:hover {
      transform: scale(1.08) translateY(-5px);
      box-shadow: 0 10px 30px rgba(255, 180, 0, 0.2);
      border-color: rgba(255, 180, 0, 0.3);
      z-index: 10;
    }

    .movie-card:hover img {
      transform: scale(1.1);
    }

    .card-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 20px 12px 12px;
      background: linear-gradient(to top, rgba(5, 8, 15, 0.95), transparent);
      display: flex;
      flex-direction: column;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .movie-card:hover .card-overlay {
      opacity: 1;
    }

    .rating {
      color: #ffb400;
      font-weight: 800;
      font-size: 0.85rem;
    }

    .movie-title {
      font-weight: 700;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .skeleton-card {
      flex: 0 0 180px;
      aspect-ratio: 2/3;
      border-radius: 8px;
      background: linear-gradient(90deg, #0a0e1a 25%, #111827 50%, #0a0e1a 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 768px) {
      .movie-card, .skeleton-card { flex: 0 0 140px; }
      .row-title { font-size: 1.3rem; }
      .scroll-btn { display: none !important; }
    }
  `]
})
export class MovieRowComponent {
  @Input() title: string = '';
  @Input() movies: MovieItem[] = [];
  @Input() loading: boolean = false;
  @Output() movieClick = new EventEmitter<MovieItem>();
  @ViewChild('rowContent') rowContent!: ElementRef;

  canScrollLeft = false;
  canScrollRight = true;

  onMovieClick(movie: MovieItem): void {
    this.movieClick.emit(movie);
  }

  scrollLeft(): void {
    const el = this.rowContent.nativeElement;
    el.scrollBy({ left: -600, behavior: 'smooth' });
  }

  scrollRight(): void {
    const el = this.rowContent.nativeElement;
    el.scrollBy({ left: 600, behavior: 'smooth' });
  }

  onScroll(): void {
    const el = this.rowContent.nativeElement;
    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 10;
  }
}
