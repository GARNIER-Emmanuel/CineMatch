import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Movie, MoviesService } from '../../../../core/services/movies';

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
            [src]="'https://www.youtube.com/embed/' + youtubeKey + '?autoplay=1&mute=1&controls=0&loop=1&playlist=' + youtubeKey | safe"
            frameborder="0"
            allow="autoplay; encrypted-media"
            class="video-bg">
          </iframe>
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
        <p class="overview">{{ movie.overview }}</p>
      </div>

      <!-- Content : Droite (Actions) -->
      <div class="actions-container">
        <button class="action-btn circle-btn" (click)="onToggleWatchlist()">
          <span class="icon">✚</span>
          <span class="label">Ma Liste</span>
        </button>
        <button class="action-btn circle-btn" (click)="onNotInterested()">
          <span class="icon">✕</span>
          <span class="label">Ignorer</span>
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
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.3s;
    }

    .circle-btn:hover {
      background: rgba(255, 180, 0, 0.2);
      border-color: #ffb400;
      transform: scale(1.1);
    }

    .circle-btn .icon { font-size: 1.5rem; margin-bottom: 4px; }
    .circle-btn .label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; }

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
  youtubeKey: string | null = null;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    if (this.movie.id) {
      this.moviesService.getMovieTrailer(this.movie.id).subscribe(trailer => {
        this.youtubeKey = trailer?.youtubeKey || null;
      });
    }
  }

  onToggleWatchlist(): void {
    // Sera implémenté dans l'US8
    console.log('Ajout à la liste:', this.movie.title);
  }

  onNotInterested(): void {
    // Sera implémenté dans l'US8
    console.log('Pas intéressé:', this.movie.title);
  }
}
