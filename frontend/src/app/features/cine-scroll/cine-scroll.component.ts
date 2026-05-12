import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService, Movie } from '../../core/services/movies';
import { CineScrollProfileService } from '../../core/services/cine-scroll-profile';
import { MoodSelectorComponent, Mood } from './components/mood-selector/mood-selector.component';
import { FilmSlideComponent } from './components/film-slide/film-slide.component';

@Component({
  selector: 'cm-cine-scroll',
  standalone: true,
  imports: [CommonModule, MoodSelectorComponent, FilmSlideComponent],
  template: `
    <div class="cinescroll-page">
      <!-- Sélection du Mood -->
      @if (state === 'MOOD_SELECTION') {
        <cm-mood-selector 
          (moodSelect)="onMoodSelected($event)"
          (skip)="onSkip()">
        </cm-mood-selector>
      }

      <!-- Chargement -->
      @if (state === 'LOADING') {
        <div class="loader-container">
          <div class="cinema-loader"></div>
          <p>Préparation de votre séance personnalisée...</p>
        </div>
      }

      <!-- Expérience de Scroll -->
      @if (state === 'SCROLLING') {
        <div class="scroll-container" (scroll)="onScroll($event)">
          @for (movie of movies; track movie.id; let i = $index) {
            <cm-film-slide 
              [movie]="movie" 
              [active]="i === activeIndex || i === activeIndex + 1">
            </cm-film-slide>
          }
        </div>
      }

      <!-- Erreur -->
      @if (state === 'ERROR') {
        <div class="error-container">
          <p>Impossible de charger les films. Veuillez réessayer.</p>
          <button class="primary-btn" (click)="reset()">Réessayer</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .cinescroll-page {
      min-height: 100vh;
      background: #030508;
      color: white;
    }

    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
    }

    .cinema-loader {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 180, 0, 0.1);
      border-top: 3px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .scroll-container {
      height: 100vh;
      overflow-y: scroll;
      scroll-snap-type: y mandatory;
    }

    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
    }

    .primary-btn {
      background: #ffb400;
      color: #030508;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 20px;
    }
  `]
})
export class CineScrollComponent implements OnInit {
  state: 'MOOD_SELECTION' | 'LOADING' | 'SCROLLING' | 'ERROR' = 'MOOD_SELECTION';
  movies: Movie[] = [];
  currentPage = 1;
  selectedGenres: string = '';
  activeIndex = 0;

  constructor(
    private moviesService: MoviesService,
    private profileService: CineScrollProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profileService.reset();
  }

  onMoodSelected(mood: Mood): void {
    this.selectedGenres = mood.genres;
    this.loadMovies();
  }

  onSkip(): void {
    this.selectedGenres = '';
    this.loadMovies();
  }

  onScroll(event: any): void {
    const element = event.target;
    this.activeIndex = Math.round(element.scrollTop / element.clientHeight);
  }

  loadMovies(): void {
    console.log('[CineScroll-FE] Chargement des films pour les genres:', this.selectedGenres);
    this.state = 'LOADING';
    this.cdr.detectChanges();
    this.moviesService.getCineScrollMovies(this.selectedGenres)
      .subscribe({
        next: (movies) => {
          console.log('[CineScroll-FE] Réception de', movies.length, 'films');
          this.movies = movies;
          this.state = 'SCROLLING';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[CineScroll-FE] Erreur lors du chargement:', err);
          this.state = 'ERROR';
          this.cdr.detectChanges();
        }
      });
  }

  reset(): void {
    this.state = 'MOOD_SELECTION';
    this.movies = [];
    this.profileService.reset();
  }
}
