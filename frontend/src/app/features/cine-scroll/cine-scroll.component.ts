import { Component, OnInit } from '@angular/core';
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
        <div class="scroll-container">
          @for (movie of movies; track movie.id) {
            <cm-film-slide [movie]="movie"></cm-film-slide>
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

    .temp-slide {
      height: 100vh;
      scroll-snap-align: start;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 180, 0, 0.1);
    }
  `]
})
export class CineScrollComponent implements OnInit {
  state: 'MOOD_SELECTION' | 'LOADING' | 'SCROLLING' | 'ERROR' = 'MOOD_SELECTION';
  movies: Movie[] = [];
  currentPage = 1;
  selectedGenres: string = '';

  constructor(
    private moviesService: MoviesService,
    private profileService: CineScrollProfileService
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

  loadMovies(): void {
    this.state = 'LOADING';
    this.moviesService.getCineScrollMovies(this.selectedGenres)
      .subscribe({
        next: (movies) => {
          this.movies = movies;
          this.state = 'SCROLLING';
        },
        error: () => {
          this.state = 'ERROR';
        }
      });
  }

  reset(): void {
    this.state = 'MOOD_SELECTION';
    this.movies = [];
    this.profileService.reset();
  }
}
