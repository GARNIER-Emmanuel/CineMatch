// CineScroll Algorithm Optimization
import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService, Movie } from '../../core/services/movies';
import { CineScrollProfileService } from '../../core/services/cine-scroll-profile';
import { MoodSelectorComponent, Mood } from './components/mood-selector/mood-selector.component';
import { FilmSlideComponent } from './components/film-slide/film-slide.component';
import { WatchedFilmsService } from '../../core/services/watched-films.service';
import { WatchlistService } from '../../core/services/watchlist';

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
              (skipFilm)="onSkipFilm(i + 1)">
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
      position: relative;
    }

    /* BOUTONS FIXES */
    .exit-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 2000;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 180, 0, 0.3);
      color: #ffb400;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.3s;
    }

    .sound-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2000;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(10px);
      font-size: 1rem;
    }

    .timer-display {
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2000;
      background: rgba(0, 0, 0, 0.7);
      border: 1px solid #ffb400;
      color: #ffb400;
      padding: 8px 16px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(10px);
      font-weight: bold;
      font-size: 1rem;
    }

    .scroll-container {
      height: 100vh;
      overflow-y: scroll;
      scroll-snap-type: y mandatory;
      scrollbar-width: none;
    }
    .scroll-container::-webkit-scrollbar { display: none; }

    /* CONCLUSION FLASH */
    .flash-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
      background: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
      text-align: center;
    }

    .flash-container h2 { font-size: 2.2rem; color: #ffb400; margin-bottom: 5px; }
    .flash-subtitle { font-size: 1rem; color: rgba(255,255,255,0.6); margin-bottom: 30px; }

    .top3-grid {
      display: flex;
      gap: 20px;
      margin-bottom: 40px;
      justify-content: center;
      width: 100%;
    }

    .top3-card {
      width: 180px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 12px;
      transition: transform 0.3s;
    }

    .top3-card img { width: 100%; border-radius: 8px; margin-bottom: 10px; }
    .top3-card h3 { font-size: 0.9rem; margin-bottom: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%; }

    .primary-btn {
      background: #ffb400;
      color: #030508;
      border: none;
      padding: 15px 40px;
      border-radius: 30px;
      font-weight: 700;
      cursor: pointer;
    }

    /* MOBILE ADAPTATION */
    @media (max-width: 768px) {
      .flash-container h2 { font-size: 1.8rem; }
      .top3-grid {
        flex-direction: column;
        align-items: center;
        gap: 15px;
      }
      .top3-card {
        width: 90%;
        max-width: 300px;
        flex-direction: row;
        display: flex;
        gap: 15px;
        text-align: left;
        align-items: center;
      }
      .top3-card img { width: 60px; margin-bottom: 0; }
      .top3-card h3 { white-space: normal; }
      
      .exit-btn, .sound-btn { top: 15px; }
      .timer-display { top: 70px; }
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

  // Radical Change Detection
  dislikeStreak = 0;
  dislikedMovieIds: Set<number> = new Set();

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

  onSkipFilm(index: number): void {
    const currentMovie = this.movies[this.activeIndex];
    if (currentMovie) {
      this.dislikedMovieIds.add(currentMovie.id);
    }
    
    this.dislikeStreak++;
    
    if (this.dislikeStreak >= 3) {
      console.log('[CineScroll] Changement radical détecté (3 dislikes consécutifs) ! Reset de la pagination.');
      this.dislikeStreak = 0;
      this.currentPage = 1;
      this.loadMovies();
    } else {
      this.scrollToIndex(index);
    }
  }

  constructor(
    private moviesService: MoviesService,
    private profileService: CineScrollProfileService,
    private watchedService: WatchedFilmsService,
    private watchlistService: WatchlistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Le profil est chargé depuis le localStorage automatiquement par le service
    this.watchedService.refresh$.subscribe(() => {
      console.log('[CineScroll] Rafraîchissement de la liste suite à un import CSV...');
      this.movies = this.movies.filter(m => !this.watchedService.isWatched(m.title, m.releaseYear, m.originalTitle));
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  onMoodSelected(event: {mood: Mood, timeLimitMs: number | null}): void {
    this.dislikeStreak = 0;
    this.selectedGenres = event.mood.genres;
    this.releaseYearMin = event.mood.releaseYearMin;
    this.releaseYearMax = event.mood.releaseYearMax;
    this.timeLimitMs = event.timeLimitMs;
    this.loadMovies();
  }

  onSkip(event: {timeLimitMs: number | null}): void {
    this.dislikeStreak = 0;
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
      // Si l'utilisateur scroll manuellement ou que l'index change, 
      // on reset le streak de dislike (car il n'a pas utilisé le bouton "Pas intéressé")
      this.dislikeStreak = 0;
      
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
          console.log(`[CineScroll-FE] ${movies.length} films reçus du backend.`);
          const processedMovies = this.processAndSortMovies(movies);
          console.log(`[CineScroll-FE] ${processedMovies.length} films restants après filtrage.`);
          
          if (processedMovies.length === 0) {
            console.warn('[CineScroll-FE] Aucun film ne correspond à vos critères et votre historique.');
            // On peut soit charger la page suivante automatiquement, soit afficher une erreur
            this.loadNextPage(); 
            return;
          }

          this.movies = processedMovies;
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
    if (this.loadingMore || this.currentPage > 15) {
      if (this.currentPage > 15) this.state = 'ERROR';
      return;
    }

    this.loadingMore = true;
    this.currentPage++;
    console.log('[CineScroll-FE] Chargement de la page', this.currentPage);

    const excluded = this.profileService.getExcludedGenres().join(',');

    this.moviesService.getCineScrollMovies(this.selectedGenres, excluded, this.currentPage, this.releaseYearMin, this.releaseYearMax)
      .subscribe({
        next: (newMovies) => {
          const processedMovies = this.processAndSortMovies(newMovies);
          console.log(`[CineScroll-FE] Page ${this.currentPage}: ${processedMovies.length} nouveaux films après filtrage.`);
          
          if (processedMovies.length === 0 && this.currentPage < 15) {
            this.loadingMore = false;
            this.loadNextPage(); // On continue de chercher
            return;
          }

          this.movies = [...this.movies, ...processedMovies];
          this.loadingMore = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingMore = false;
          this.state = 'ERROR';
          this.cdr.detectChanges();
        }
      });
  }

  private processAndSortMovies(newMovies: Movie[]): Movie[] {
    // 1. Filtrer les films vus Letterboxd + Doublons + Invalides
    let filtered = newMovies.filter(m => {
      if (!m || !m.id || !m.title) return false; // Sécurité anti-phantom
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
      
      // A. Score Genres
      if (movie.genreIds) {
        movie.genreIds.forEach(genreId => {
          if (profile.likedGenres[genreId]) {
            score += profile.likedGenres[genreId]; // +1 par like sur ce genre
          }
          if (profile.dislikedGenres[genreId]) {
            score -= profile.dislikedGenres[genreId]; // -1 par dislike
          }
        });
      }

      // B. Bonus Réalisateur / Acteurs (+2 points)
      if (movie.director && profile.likedPeople[movie.director]) {
        score += 2;
      }
      if (movie.cast) {
        movie.cast.forEach(actor => {
          if (profile.likedPeople[actor]) {
            score += 2;
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
    
    console.log('[CineScroll] Calcul de la conclusion flash (Top 3)...');
    
    // 1. On récupère le profil final
    const profile = this.profileService.getProfile();
    
    // 2. On prend tous les films chargés dans la session, sauf ceux explicitement dislikés
    // (Note: on ne filtre pas les 'seenMovieIds' car on veut justement proposer le meilleur de ce qui a été vu ou chargé)
    const candidates = this.movies.filter(m => !this.dislikedMovieIds.has(m.id));

    // 3. Re-scoring complet avec les poids finaux
    const finalScored = candidates.map(movie => {
      let score = 0;
      
      // A. Score Genres (Poids final cumulé)
      if (movie.genreIds) {
        movie.genreIds.forEach(gid => {
          score += (profile.likedGenres[gid] || 0);
          score -= (profile.dislikedGenres[gid] || 0);
        });
      }

      // B. Bonus People (Final)
      if (movie.director && profile.likedPeople[movie.director]) score += 5; // Bonus boosté pour la conclusion
      if (movie.cast) {
        movie.cast.forEach(actor => {
          if (profile.likedPeople[actor]) score += 3;
        });
      }

      // C. Boost interaction (Si le film est en watchlist ou a été bien noté)
      if (this.watchlistService.isInWatchlist(movie.id)) score += 10;
      
      return { movie, score };
    });

    // 4. Tri final et sélection du Top 3
    finalScored.sort((a, b) => b.score - a.score);
    this.top3Movies = finalScored.slice(0, 3).map(s => s.movie);
    
    this.state = 'FLASH_CONCLUSION';
    this.cdr.detectChanges();
  }

  reset(): void {
    this.stopTimer();
    this.state = 'MOOD_SELECTION';
    this.movies = [];
    this.top3Movies = [];
    this.seenMovieIds.clear();
    this.dislikedMovieIds.clear();
    this.currentPage = 1;
    this.timeLimitMs = null;
    this.profileService.reset();
  }
}
