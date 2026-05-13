// Film Slide with interactive actions and barometer
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Movie, MoviesService } from '../../../../core/services/movies';
import { WatchlistService } from '../../../../core/services/watchlist';
import { CineScrollProfileService } from '../../../../core/services/cine-scroll-profile';
import { MovieItem } from '../../../home/movie-row/movie-row';

@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'cm-film-slide',
  standalone: true,
  imports: [CommonModule, SafePipe],
  template: `
    <div class="slide-container">
      <!-- Arrière-plan : Vidéo ou Image -->
      <div class="media-background">
        @if (youtubeKey) {
          <iframe 
            [src]="'https://www.youtube.com/embed/' + youtubeKey + '?autoplay=1&mute=' + (isMuted ? '1' : '0') + '&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&playsinline=1&playlist=' + youtubeKey + '&loop=1' | safe"
            frameborder="0"
            allow="autoplay; encrypted-media"
            class="video-bg">
          </iframe>
        } @else if (backdrops.length > 0) {
          <div class="slideshow-container">
            @for (img of backdrops; track $index) {
              <div 
                class="slide-img" 
                [class.active]="currentSlideIndex === $index"
                [style.backgroundImage]="'url(' + img + ')'">
              </div>
            }
          </div>
        } @else {
          <div class="backdrop-fallback" [style.backgroundImage]="'url(' + movie.backdrop + ')'"></div>
        }
        
        <!-- iOS Autoplay Fallback Overlay -->
        @if (isAutoplayBlocked) {
          <div class="autoplay-fallback-overlay" (click)="onPlayVideo()">
            <div class="play-trigger">
              <span class="play-icon">▶</span>
              <p>Lancer la bande-annonce</p>
            </div>
          </div>
        }

        <div class="overlay-vignette"></div>
      </div>

      <!-- Content : Haut Gauche (Poster) -->
      <div class="poster-container">
        <img [src]="movie.poster" [alt]="movie.title" class="poster-img">
      </div>

      <!-- Content : Bas Gauche (Infos) -->
      <div class="info-container">
        <div class="meta-row">
          <span class="rating">★ {{ movie.rating }}</span>
          <span class="duration" *ngIf="credits?.runtime">{{ formatRuntime(credits!.runtime) }}</span>
        </div>
        <h1 class="movie-title">{{ movie.title }} ({{ movie.releaseYear }})</h1>
        
        <div class="credits" *ngIf="credits">
          <p><span>Réal:</span> {{ credits.director }}</p>
          <p><span>Casting:</span> {{ credits.cast.join(', ') }}</p>
        </div>

        <p class="overview">{{ movie.overview }}</p>
      </div>

      <!-- Content : Droite (Actions) -->
      <div class="actions-container">
        <!-- Watchlist -->
        <button 
          class="circle-btn like" 
          [class.active]="isInWatchlist()"
          (click)="onToggleWatchlist()" 
          [title]="isInWatchlist() ? 'Retirer de ma liste' : 'Ajouter à ma liste'">
          <span class="icon">{{ isInWatchlist() ? '★' : '♥' }}</span>
        </button>
        
        <!-- Pas intéressé -->
        <button class="circle-btn dislike" (click)="onNotInterested()" title="Pas intéressé (Masquer)">
          <span class="icon">✕</span>
        </button>

        <!-- Baromètre d'envie -->
        <div class="barometer-container">
          <p class="barometer-title">Niveau d'envie</p>
          <div class="stars-row">
            <button class="star-btn" (click)="onBarometer(1)" [class.active]="envieScore >= 1" title="Curiosité faible">★</button>
            <button class="star-btn" (click)="onBarometer(2)" [class.active]="envieScore >= 2" title="Intérêt marqué">★</button>
            <button class="star-btn" (click)="onBarometer(3)" [class.active]="envieScore >= 3" title="Priorité absolue">★</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .slide-container {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      scroll-snap-align: start;
      background: #000;
      display: flex;
      flex-direction: column;
    }

    /* MEDIA / VIDEO */
    .media-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .video-bg {
      width: 100vw;
      height: 56.25vw;
      min-height: 100vh;
      min-width: 177.77vh;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .slideshow-container, .backdrop-fallback {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
    }

    .overlay-vignette {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.6) 100%),
                  linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 30%);
      z-index: 1;
    }

    /* POSTER */
    .poster-container {
      position: absolute;
      top: 40px;
      left: 40px;
      z-index: 10;
      animation: fadeIn 1s ease-out;
    }

    .poster-img {
      width: 140px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      border: 1px solid rgba(255,180,0,0.2);
    }

    /* INFO */
    .info-container {
      position: absolute;
      bottom: 60px;
      left: 40px;
      max-width: 500px;
      z-index: 10;
      animation: slideUp 0.8s ease-out;
    }

    .movie-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 10px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.8);
    }

    .overview {
      font-size: 0.9rem;
      line-height: 1.5;
      color: rgba(255,255,255,0.7);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .meta-row { display: flex; gap: 15px; margin-bottom: 10px; }
    .rating { color: #ffb400; font-weight: 800; font-size: 1.2rem; }
    .duration { color: rgba(255, 255, 255, 0.5); font-size: 0.9rem; }
    .credits { margin-bottom: 10px; font-size: 0.7rem; color: rgba(255,255,255,0.4); }
    .credits span { color: #ffb400; }

    /* ACTIONS */
    .actions-container {
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 20px;
      z-index: 10;
    }

    .circle-btn {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(15px);
      transition: all 0.3s;
    }

    .circle-btn .icon { font-size: 1.8rem; }
    .like.active { color: #ffb400; border-color: #ffb400; background: rgba(255,180,0,0.1); }

    .barometer-container {
      background: rgba(0, 0, 0, 0.6);
      border-radius: 15px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      backdrop-filter: blur(10px);
    }
    .barometer-title { font-size: 0.6rem; color: rgba(255,255,255,0.5); margin-bottom: 5px; text-transform: uppercase; }
    .stars-row { display: flex; gap: 5px; }
    .star-btn { background: none; border: none; color: rgba(255,255,255,0.2); font-size: 1.2rem; cursor: pointer; }
    .star-btn.active { color: #ffb400; }

    /* MOBILE ADAPTATION */
    @media (max-width: 768px) {
      .slide-container {
        justify-content: flex-start;
      }

      .media-background {
        position: relative;
        height: 35vh; /* Vidéo au milieu */
        order: 2;
      }

      .video-bg {
        height: 100%;
        width: 100%;
        min-height: unset;
        min-width: unset;
        transform: none;
        top: 0;
        left: 0;
        object-fit: cover;
      }

      .overlay-vignette {
        background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%);
      }

      .poster-container {
        position: relative;
        top: 0;
        left: 0;
        height: 40vh; /* Affiche en haut */
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #000;
        order: 1;
        padding: 20px;
      }

      .poster-img {
        height: 90%;
        width: auto;
        max-width: 100%;
      }

      .info-container {
        position: relative;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 20px;
        order: 3;
        flex: 1;
        background: linear-gradient(to top, #000 80%, transparent 100%);
        max-width: none;
      }

      .movie-title { font-size: 1.4rem; margin-bottom: 5px; }
      .overview { -webkit-line-clamp: 2; font-size: 0.85rem; }
      .credits { display: none; }

      .actions-container {
        position: fixed;
        right: 20px;
        bottom: 20px;
        top: auto;
        transform: none;
        flex-direction: row;
        gap: 15px;
      }

      .circle-btn {
        width: 50px;
        height: 50px;
      }

      .circle-btn .icon { font-size: 1.4rem; }

      .barometer-container {
        display: none; /* Trop encombrant sur mobile direct */
      }
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* IOS FALLBACK STYLES */
    .autoplay-fallback-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(8px);
      cursor: pointer;
      animation: fadeIn 0.5s ease-out;
    }

    .play-trigger {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      color: white;
      text-align: center;
    }

    .play-icon {
      width: 80px;
      height: 80px;
      background: #ffb400;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      color: #000;
      padding-left: 6px;
      box-shadow: 0 0 30px rgba(255, 180, 0, 0.4);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .play-trigger p {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.8rem;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }

    .autoplay-fallback-overlay:hover .play-icon {
      transform: scale(1.15);
    }
  `]
})
export class FilmSlideComponent implements OnInit, OnDestroy {
  @Input() movie!: Movie;
  @Input() isMuted = true;
  @Input() set preloading(value: boolean) {
    if (value && !this.cachedTrailerKey && !this.loadingTrailer) {
      this.loadTrailer();
    }
  }

  @Input() set active(value: boolean) {
    this._active = value;
    if (value) {
      this.isAutoplayBlocked = this.isIOS();
      if (this.cachedTrailerKey) {
        this.youtubeKey = this.cachedTrailerKey;
      } else if (!this.loadingTrailer) {
        this.loadTrailer();
      }
      this.loadCredits();
    } else {
      this.youtubeKey = null;
      this.isAutoplayBlocked = false;
    }
  }

  @Output() skipFilm = new EventEmitter<void>();

  _active = false;
  isAutoplayBlocked = false;
  youtubeKey: string | null = null;
  cachedTrailerKey: string | null = null;
  loadingTrailer = false;
  
  backdrops: string[] = [];
  currentSlideIndex = 0;
  credits: { director: string; cast: string[]; runtime: number } | null = null;
  envieScore = 0;

  private isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  onPlayVideo(): void {
    // Une fois que l'utilisateur a interagi (clic sur ▶), 
    // Safari autorise la lecture. On reset l'état.
    this.isAutoplayBlocked = false;
    this.cdr.detectChanges();
  }

  private slideshowInterval: any;
  private watchlistService: WatchlistService;
  private profileService: CineScrollProfileService;

  constructor(
    private moviesService: MoviesService,
    watchlistService: WatchlistService,
    profileService: CineScrollProfileService,
    private cdr: ChangeDetectorRef
  ) {
    this.watchlistService = watchlistService;
    this.profileService = profileService;
  }

  ngOnInit(): void {
    if (this._active && this.movie) {
      this.loadCredits();
    }
  }

  loadTrailer(): void {
    if (!this.movie.id) return;
    this.loadingTrailer = true;
    this.moviesService.getMovieTrailer(this.movie.id).subscribe({
      next: (trailer) => {
        this.cachedTrailerKey = trailer?.youtubeKey || null;
        if (this._active) {
          this.youtubeKey = this.cachedTrailerKey;
          if (!this.youtubeKey) {
            this.loadImages();
          }
        }
        this.loadingTrailer = false;
      },
      error: () => {
        this.loadingTrailer = false;
        if (this._active) this.loadImages();
      }
    });
  }

  loadImages(): void {
    if (this.backdrops.length > 0) {
      this.startSlideshow();
      return;
    }

    this.moviesService.getMovieImages(this.movie.id).subscribe(images => {
      this.backdrops = images;
      if (this.backdrops.length > 0) {
        this.startSlideshow();
      }
    });
  }

  startSlideshow(): void {
    this.stopSlideshow();
    this.currentSlideIndex = 0;
    if (this.backdrops.length > 1) {
      this.slideshowInterval = setInterval(() => {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.backdrops.length;
      }, 5000);
    }
  }

  stopSlideshow(): void {
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
    }
  }

  loadCredits(): void {
    if (this.credits || !this.movie?.id) return;
    this.moviesService.getMovieCredits(this.movie.id).subscribe(c => {
      this.credits = c;
      this.cdr.detectChanges();
    });
  }

  formatRuntime(minutes: number): string {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  onToggleWatchlist(): void {
    const movieItem: MovieItem = {
      id: this.movie.id,
      title: this.movie.title,
      poster: this.movie.poster || '',
      backdrop: this.movie.backdrop || '',
      rating: this.movie.rating,
      overview: this.movie.overview,
      releaseYear: this.movie.releaseYear
    };

    this.watchlistService.toggleWatchlist(movieItem);
    
    if (this.watchlistService.isInWatchlist(this.movie.id)) {
      // Intérêt fort : On force 3 étoiles (poids 3) par défaut si on ajoute à la liste
      const weightToAdd = Math.max(3 - this.envieScore, 1);
      this.envieScore = 3;
      this.profileService.like(this.movie.genreIds || [], weightToAdd);
      this.recordLikedPeople();
    }
  }

  onNotInterested(): void {
    this.profileService.dislike(this.movie.genreIds || []);
    this.skipFilm.emit();
  }

  onBarometer(score: number): void {
    const diff = score - this.envieScore;
    if (diff === 0) return; // Déjà à ce score

    this.envieScore = score;
    
    if (diff > 0) {
      // Aime davantage
      this.profileService.like(this.movie.genreIds || [], diff);
      if (score >= 2) this.recordLikedPeople();
    } else {
      // Aime moins qu'avant
      this.profileService.dislike(this.movie.genreIds || [], Math.abs(diff));
    }
  }

  private recordLikedPeople(): void {
    if (!this.credits) return;
    // On enregistre le réalisateur et les 3 premiers acteurs
    const names = [this.credits.director, ...this.credits.cast.slice(0, 3)];
    this.profileService.likePeople(names);
  }

  isInWatchlist(): boolean {
    return this.watchlistService.isInWatchlist(this.movie.id);
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }
}
