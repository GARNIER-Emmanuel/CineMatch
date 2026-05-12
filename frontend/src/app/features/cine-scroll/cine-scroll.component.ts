import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
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
      <!-- BOUTON QUITTER -->
      <button class="exit-btn" (click)="onExit()" title="Quitter la salle">
        <span class="icon">←</span>
      </button>

      <!-- BOUTON SON -->
      <button class="sound-btn" (click)="toggleSound()" [title]="isMuted ? 'Activer le son' : 'Couper le son'">
        <span class="icon">{{ isMuted ? '🔇' : '🔊' }}</span>
      </button>

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
        <div class="scroll-container" #scrollContainer (scroll)="onScroll($event)">
          @for (movie of movies; track movie.id; let i = $index) {
            <cm-film-slide 
              [movie]="movie" 
              [active]="i === activeIndex"
              [preloading]="i === activeIndex + 1"
              [isMuted]="isMuted">
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

    .exit-btn {
      position: fixed;
      top: 30px;
      left: 30px;
      z-index: 2000;
      background: rgba(255, 180, 0, 0.1);
      border: 1px solid rgba(255, 180, 0, 0.3);
      color: var(--primary-color);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .exit-btn:hover {
      background: var(--primary-color);
      color: #030508;
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(255, 180, 0, 0.4);
    }

    .sound-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 2000;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      font-size: 1.2rem;
    }

    .sound-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
      border-color: var(--primary-color);
    }

    .exit-btn .icon { 
      font-size: 1.2rem;
      transition: transform 0.3s;
    }

    .exit-btn:hover .icon {
      transform: translateX(-2px);
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
  releaseYearMin?: number;
  releaseYearMax?: number;
  activeIndex = 0;
  loadingMore = false;
  isMuted = true; // Par défaut muet pour l'autolpay navigateur

  @ViewChild('scrollContainer') scrollContainer?: ElementRef;
  @Output() close = new EventEmitter<void>();

  toggleSound(): void {
    this.isMuted = !this.isMuted;
    this.cdr.detectChanges();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.state !== 'SCROLLING') return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.scrollToIndex(this.activeIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.scrollToIndex(this.activeIndex - 1);
    }
  }

  scrollToIndex(index: number): void {
    if (index < 0 || index >= this.movies.length || !this.scrollContainer) return;
    
    const container = this.scrollContainer.nativeElement;
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: 'smooth'
    });
  }

  constructor(
    private moviesService: MoviesService,
    private profileService: CineScrollProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Le profil est chargé depuis le localStorage automatiquement par le service
  }

  onMoodSelected(mood: Mood): void {
    this.selectedGenres = mood.genres;
    this.releaseYearMin = mood.releaseYearMin;
    this.releaseYearMax = mood.releaseYearMax;
    this.loadMovies();
  }

  onSkip(): void {
    this.selectedGenres = '';
    this.releaseYearMin = undefined;
    this.releaseYearMax = undefined;
    this.loadMovies();
  }

  onScroll(event: any): void {
    const element = event.target;
    const newIndex = Math.round(element.scrollTop / element.clientHeight);
    
    if (newIndex !== this.activeIndex) {
      this.activeIndex = newIndex;
      this.cdr.detectChanges();

      // Si on arrive vers les 3 derniers films, on charge la suite
      if (this.activeIndex >= this.movies.length - 3 && !this.loadingMore) {
        this.loadNextPage();
      }
    }
  }

  onExit(): void {
    this.close.emit();
  }

  loadMovies(): void {
    console.log('[CineScroll-FE] Chargement des films pour les genres:', this.selectedGenres);
    this.state = 'LOADING';
    this.cdr.detectChanges();

    const preferred = this.profileService.getPreferredGenres().join(',');
    const excluded = this.profileService.getExcludedGenres().join(',');
    
    // On combine les genres du mood et les genres préférés
    const combinedGenres = [this.selectedGenres, preferred].filter(g => !!g).join(',');

    this.moviesService.getCineScrollMovies(combinedGenres, excluded, 1, this.releaseYearMin, this.releaseYearMax)
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

  loadNextPage(): void {
    this.loadingMore = true;
    this.currentPage++;
    console.log('[CineScroll-FE] Chargement de la page', this.currentPage);

    const preferred = this.profileService.getPreferredGenres().join(',');
    const excluded = this.profileService.getExcludedGenres().join(',');
    const combinedGenres = [this.selectedGenres, preferred].filter(g => !!g).join(',');

    this.moviesService.getCineScrollMovies(combinedGenres, excluded, this.currentPage, this.releaseYearMin, this.releaseYearMax)
      .subscribe({
        next: (newMovies) => {
          this.movies = [...this.movies, ...newMovies];
          this.loadingMore = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingMore = false;
          this.cdr.detectChanges();
        }
      });
  }

  reset(): void {
    this.state = 'MOOD_SELECTION';
    this.movies = [];
    this.currentPage = 1;
    this.profileService.reset();
  }
}
