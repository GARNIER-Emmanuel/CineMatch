import { Component, Input, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
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
        <div class="overlay-vignette"></div>
      </div>

      <!-- Content : Haut Gauche (Poster) -->
      <div class="poster-container">
        <img [src]="movie.poster" [alt]="movie.title" class="poster-img">
      </div>

      <!-- Content : Bas Gauche (Infos) -->
      <div class="info-container">
        <span class="rating">★ {{ movie.rating }}</span>
        <h1 class="movie-title">{{ movie.title }} ({{ movie.releaseYear }})</h1>
        
        <div class="credits" *ngIf="credits">
          <p><span>Réal:</span> {{ credits.director }}</p>
          <p><span>Casting:</span> {{ credits.cast.join(', ') }}</p>
        </div>

        <p class="overview">{{ movie.overview }}</p>
      </div>

      <!-- Content : Droite (Actions) -->
      <div class="actions-container">
        <button 
          class="circle-btn like" 
          [class.active]="isInWatchlist()"
          (click)="onToggleWatchlist()" 
          [title]="isInWatchlist() ? 'Retirer de ma liste' : 'Ajouter à ma liste'">
          <span class="icon">{{ isInWatchlist() ? '★' : '♥' }}</span>
        </button>
        <button class="circle-btn dislike" (click)="onNotInterested()" title="Pas intéressé">
          <span class="icon">✕</span>
        </button>
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
    }

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
      height: 56.25vw; /* 16:9 ratio */
      min-height: 100vh;
      min-width: 177.77vh; /* 16:9 ratio */
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .slideshow-container {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .slide-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1.5s ease-in-out;
    }

    .slide-img.active {
      opacity: 1;
    }

    .backdrop-fallback {
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

    .info-container {
      position: absolute;
      bottom: 60px;
      left: 40px;
      max-width: 500px;
      z-index: 10;
      animation: slideUp 0.8s ease-out;
    }

    .rating {
      color: #ffb400;
      font-weight: 800;
      font-size: 1.2rem;
      display: block;
      margin-bottom: 10px;
    }

    .movie-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 15px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.8);
    }

    .overview {
      font-size: 1rem;
      line-height: 1.5;
      color: rgba(255,255,255,0.8);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .credits {
      margin-bottom: 15px;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.6);
    }

    .credits p { margin: 2px 0; }
    .credits span { color: #ffb400; font-weight: 700; }

    .actions-container {
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 30px;
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
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .circle-btn:hover {
      transform: scale(1.15);
    }

    .like:hover, .like.active {
      background: rgba(255, 180, 0, 0.1);
      border-color: #ffb400;
      color: #ffb400;
    }

    .like.active {
      background: rgba(255, 180, 0, 0.2);
      box-shadow: 0 0 15px rgba(255, 180, 0, 0.3);
    }

    .dislike:hover {
      background: rgba(255, 59, 48, 0.1);
      border-color: #ff3b30;
      color: #ff3b30;
    }

    .circle-btn .icon { font-size: 1.8rem; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .movie-title { font-size: 1.8rem; }
      .poster-img { width: 100px; }
      .actions-container { right: 20px; }
    }
  `]
})
export class FilmSlideComponent implements OnInit {
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
      if (this.cachedTrailerKey) {
        this.youtubeKey = this.cachedTrailerKey;
      } else if (!this.loadingTrailer) {
        this.loadTrailer();
      }
      this.loadCredits();
    } else {
      this.youtubeKey = null;
    }
  }

  _active = false;
  youtubeKey: string | null = null;
  cachedTrailerKey: string | null = null;
  loadingTrailer = false;
  
  backdrops: string[] = [];
  currentSlideIndex = 0;
  credits: { director: string; cast: string[] } | null = null;
  private slideshowInterval: any;
  private watchlistService: WatchlistService;
  private profileService: CineScrollProfileService;

  constructor(
    private moviesService: MoviesService,
    watchlistService: WatchlistService,
    profileService: CineScrollProfileService
  ) {
    this.watchlistService = watchlistService;
    this.profileService = profileService;
  }

  ngOnInit(): void {
    // On ne charge rien au init, on attend que le composant soit "actif"
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
    if (this.credits) return;
    this.moviesService.getMovieCredits(this.movie.id).subscribe(c => {
      this.credits = c;
    });
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
      this.profileService.like(this.movie.genreIds || []);
    }
  }

  onNotInterested(): void {
    this.profileService.dislike(this.movie.genreIds || []);
    // Optionnel : on pourrait passer au film suivant automatiquement ici
    console.log('Ignoré, profil mis à jour');
  }

  isInWatchlist(): boolean {
    return this.watchlistService.isInWatchlist(this.movie.id);
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }
}
