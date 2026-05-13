import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService, Movie } from '../../core/services/movies';
import { CineScrollProfileService } from '../../core/services/cine-scroll-profile';
import { MoodSelectorComponent, Mood } from './components/mood-selector/mood-selector.component';
import { FilmSlideComponent } from './components/film-slide/film-slide.component';
import { WatchedFilmsService } from '../../core/services/watched-films.service';

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

      <!-- Chronomètre (Session Express) -->
      @if (state === 'SCROLLING' && timeLimitMs) {
        <div class="timer-display">
          <span class="timer-icon">⚡</span>
          <span class="timer-text">{{ formatTime(remainingTimeMs) }}</span>
        </div>
      }

      <!-- Sélection du Mood -->
      @if (state === 'MOOD_SELECTION') {
        <cm-mood-selector 
          (moodSelect)="onMoodSelected($event)"
          (skip)="onSkip($event)">
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
              [isMuted]="isMuted"
              (skipFilm)="scrollToIndex(i + 1)">
            </cm-film-slide>
          }
        </div>
      }

      <!-- Conclusion Flash -->
      @if (state === 'FLASH_CONCLUSION') {
        <div class="flash-container">
          <h2>Le Chrono est écoulé ! ⚡</h2>
          <p class="flash-subtitle">Voici votre Top 3 pour ce soir, basé sur vos choix à l'instant :</p>
          <div class="top3-grid">
            @for (movie of top3Movies; track movie.id) {
              <div class="top3-card glass">
                <img [src]="movie.poster" [alt]="movie.title">
                <h3>{{ movie.title }}</h3>
                <span class="rating">★ {{ movie.rating }}</span>
              </div>
            }
          </div>
          <button class="primary-btn" (click)="reset()">Refaire une session</button>
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
      right: 30px;
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

    .timer-display {
      position: fixed;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2000;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid #ffb400;
      color: #ffb400;
      padding: 10px 20px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 10px;
      backdrop-filter: blur(10px);
      font-weight: bold;
      font-size: 1.2rem;
      box-shadow: 0 0 15px rgba(255, 180, 0, 0.2);
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

    /* Conclusion Flash */
    .flash-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px;
      background: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
      animation: fadeIn 1s ease-out;
    }

    .flash-container h2 {
      font-size: 3rem;
      color: #ffb400;
      margin-bottom: 10px;
      text-shadow: 0 0 20px rgba(255, 180, 0, 0.5);
    }

    .flash-subtitle {
      font-size: 1.2rem;
      color: rgba(255,255,255,0.7);
      margin-bottom: 40px;
    }

    .top3-grid {
      display: flex;
      gap: 30px;
      margin-bottom: 50px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .top3-card {
      width: 220px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: transform 0.3s;
    }

    .top3-card:hover {
      transform: translateY(-10px);
      border-color: #ffb400;
      box-shadow: 0 10px 30px rgba(255,180,0,0.2);
    }

    .top3-card img {
      width: 100%;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .top3-card h3 {
      font-size: 1.1rem;
      margin-bottom: 10px;
    }

    .top3-card .rating {
      color: #ffb400;
      font-weight: bold;
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
      transition: all 0.3s;
    }

    .primary-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(255,180,0,0.5);
    }
  `]
})
export class CineScrollComponent implements OnInit, OnDestroy {
  state: 'MOOD_SELECTION' | 'LOADING' | 'SCROLLING' | 'ERROR' | 'FLASH_CONCLUSION' = 'MOOD_SELECTION';
  movies: Movie[] = [];
  top3Movies: Movie[] = [];
  currentPage = 1;
  selectedGenres: string = '';
  releaseYearMin?: number;
  releaseYearMax?: number;
  activeIndex = 0;
  loadingMore = false;
  isMuted = true; // Par défaut muet pour l'autolpay navigateur

  // Express Mode
  timeLimitMs: number | null = null;
  remainingTimeMs = 0;
  private timerInterval: any;

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
    private watchedService: WatchedFilmsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Le profil est chargé depuis le localStorage automatiquement par le service
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  onMoodSelected(event: {mood: Mood, timeLimitMs: number | null}): void {
    this.selectedGenres = event.mood.genres;
    this.releaseYearMin = event.mood.releaseYearMin;
    this.releaseYearMax = event.mood.releaseYearMax;
    this.timeLimitMs = event.timeLimitMs;
    this.loadMovies();
  }

  onSkip(event: {timeLimitMs: number | null}): void {
    this.selectedGenres = '';
    this.releaseYearMin = undefined;
    this.releaseYearMax = undefined;
    this.timeLimitMs = event.timeLimitMs;
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
    this.stopTimer();
    this.close.emit();
  }

  seenMovieIds: Set<number> = new Set();

  loadMovies(): void {
    console.log('[CineScroll-FE] Chargement des films pour les genres:', this.selectedGenres);
    this.state = 'LOADING';
    this.seenMovieIds.clear();
    this.cdr.detectChanges();

    const excluded = this.profileService.getExcludedGenres().join(',');

    // Requête large TMDB : uniquement le Mood et les exclusions dures
    this.moviesService.getCineScrollMovies(this.selectedGenres, excluded, 1, this.releaseYearMin, this.releaseYearMax)
      .subscribe({
        next: (movies) => {
          console.log('[CineScroll-FE] Réception de', movies.length, 'films');
          this.movies = this.processAndSortMovies(movies);
          this.state = 'SCROLLING';
          if (this.timeLimitMs) this.startTimer();
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

    const excluded = this.profileService.getExcludedGenres().join(',');

    // TMDB fournit le prochain bloc, toujours basé sur le Mood initial
    this.moviesService.getCineScrollMovies(this.selectedGenres, excluded, this.currentPage, this.releaseYearMin, this.releaseYearMax)
      .subscribe({
        next: (newMovies) => {
          const processedMovies = this.processAndSortMovies(newMovies);
          this.movies = [...this.movies, ...processedMovies];
          this.loadingMore = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingMore = false;
          this.cdr.detectChanges();
        }
      });
  }

  private processAndSortMovies(newMovies: Movie[]): Movie[] {
    // 1. Filtrer les films vus Letterboxd + Doublons de la session actuelle
    let filtered = newMovies.filter(m => {
      if (this.seenMovieIds.has(m.id)) return false;
      if (this.watchedService.isWatched(m.title, m.releaseYear, m.originalTitle)) return false;
      return true;
    });

    // 2. Marquer comme vus dans la session
    filtered.forEach(m => this.seenMovieIds.add(m.id));

    // 3. Calcul d'affinité (Scoring dynamique)
    const profile = this.profileService.getProfile();
    const scoredMovies = filtered.map(movie => {
      let score = 0;
      if (movie.genreIds) {
        movie.genreIds.forEach(genreId => {
          if (profile.likedGenres[genreId]) {
            score += profile.likedGenres[genreId]; // +1 par like sur ce genre (cumulatif)
          }
          if (profile.dislikedGenres[genreId]) {
            score -= profile.dislikedGenres[genreId]; // -1 par dislike
          }
        });
      }
      return { movie, score };
    });

    // 4. Tri par score décroissant (les plus affinitaires d'abord)
    scoredMovies.sort((a, b) => b.score - a.score);

    return scoredMovies.map(item => item.movie);
  }

  // --- TIMER LOGIC ---

  startTimer(): void {
    this.remainingTimeMs = this.timeLimitMs || 0;
    this.timerInterval = setInterval(() => {
      this.remainingTimeMs -= 1000;
      if (this.remainingTimeMs <= 0) {
        this.endSessionFlash();
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(ms: number): string {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  endSessionFlash(): void {
    this.stopTimer();
    this.state = 'FLASH_CONCLUSION';
    // Le Top 3 prend simplement les 3 meilleurs films parmi ceux qui restaient au moment de la conclusion,
    // car processAndSortMovies garantit qu'ils sont triés par la plus forte affinité !
    this.top3Movies = this.movies.slice(0, 3);
  }

  reset(): void {
    this.stopTimer();
    this.state = 'MOOD_SELECTION';
    this.movies = [];
    this.top3Movies = [];
    this.seenMovieIds.clear();
    this.currentPage = 1;
    this.timeLimitMs = null;
    this.profileService.reset();
  }
}
