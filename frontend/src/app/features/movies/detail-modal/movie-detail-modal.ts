import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieItem } from '../../home/movie-row/movie-row';
import { MoviesService, WatchProvider } from '../../../core/services/movies';
import { WatchlistService } from '../../../core/services/watchlist';

@Component({
  selector: 'cm-movie-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()">
      <div class="modal-container glass" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">✕</button>
        
        <div class="modal-content">
          <div class="movie-poster">
            <img [src]="movie.poster" [alt]="movie.title">
            <div class="poster-glow"></div>
          </div>

          <div class="movie-info">
            <h1 class="movie-title">{{ movie.title }}</h1>
            <div class="movie-meta">
              <span class="rating">★ {{ movie.rating }}</span>
              <span class="year">{{ movie.releaseYear }}</span>
              <span class="duration" *ngIf="credits?.runtime">{{ formatRuntime(credits!.runtime) }}</span>
            </div>

            <div class="credits" *ngIf="credits">
              <p><strong>Réalisation :</strong> {{ credits.director }}</p>
              <p><strong>Casting :</strong> {{ credits.cast.join(', ') }}</p>
            </div>
            
            <p class="overview">{{ movie.overview }}</p>

            <!-- Plateformes -->
            <div class="providers-section">
              <h3>Disponible sur</h3>
              <div class="providers-list">
                <div *ngIf="loadingProviders" class="provider-skeleton"></div>
                @for (provider of providers; track provider.id) {
                  <div class="provider-item" [title]="provider.name">
                    <img [src]="'https://image.tmdb.org/t/p/original' + provider.logo" [alt]="provider.name">
                  </div>
                }
                <p *ngIf="!loadingProviders && providers.length === 0" class="no-providers">
                  Non disponible en streaming actuellement.
                </p>
              </div>
            </div>

            <div class="actions">
              <button 
                class="btn-primary" 
                [class.in-list]="isInWatchlist"
                (click)="toggleWatchlist()">
                {{ isInWatchlist ? '✓ Dans Ma Liste' : '+ Ajouter à Ma Liste' }}
              </button>
              
              <div class="feedback-actions">
                <button class="btn-icon" (click)="giveFeedback('like')" [title]="'J\\'aime'">👍</button>
                <button class="btn-icon" (click)="giveFeedback('dislike')" [title]="'Je n\\'aime pas'">👎</button>
                <button class="btn-icon share" (click)="onShare()" title="Partager">📤</button>
              </div>
            </div>

            <div class="feedback-msg" *ngIf="feedbackSent">
              Merci pour votre avis !
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(5, 8, 15, 0.9);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.3s ease-out;
    }

    .modal-container {
      width: 100%;
      max-width: 1100px;
      max-height: 90vh;
      background: #0a0e1a;
      border-radius: 16px;
      position: relative;
      overflow-y: auto;
      border: 1px solid rgba(255, 180, 0, 0.2);
      animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      z-index: 10;
      transition: all 0.3s;
    }

    .close-btn:hover {
      background: #ffb400;
      color: #05080f;
    }

    .modal-content {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 50px;
      padding: 50px;
    }

    .movie-poster {
      position: relative;
    }

    .movie-poster img {
      width: 100%;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 180, 0, 0.1);
    }

    .poster-glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-shadow: 0 0 60px rgba(255, 180, 0, 0.1);
      pointer-events: none;
    }

    .movie-title {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      font-weight: 900;
      margin-bottom: 10px;
      line-height: 1.1;
      color: white;
    }

    .movie-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 25px;
      font-weight: 700;
    }

    .rating { color: #ffb400; }
    .year { color: rgba(255, 255, 255, 0.5); }
    .duration { color: rgba(255, 255, 255, 0.5); }

    .overview {
      font-size: 0.95rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 25px;
    }

    .credits {
      margin-bottom: 20px;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
    }

    .credits p { margin: 5px 0; }
    .credits strong { color: var(--primary-color); font-weight: 700; }

    .providers-section h3 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 15px;
    }

    .providers-list {
      display: flex;
      gap: 15px;
      margin-bottom: 40px;
      min-height: 45px;
    }

    .provider-item img {
      width: 45px;
      height: 45px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .btn-primary {
      background: #ffb400;
      color: #05080f;
      border: none;
      padding: 14px 28px;
      border-radius: 30px;
      font-weight: 800;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(255, 180, 0, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 180, 0, 0.4);
    }

    .btn-primary.in-list {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      box-shadow: none;
    }

    .feedback-actions {
      display: flex;
      gap: 10px;
    }

    .btn-icon {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: rgba(255, 180, 0, 0.1);
      border-color: #ffb400;
    }

    .feedback-msg {
      margin-top: 20px;
      color: #ffb400;
      font-weight: 700;
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    @media (max-width: 850px) {
      .modal-content { grid-template-columns: 1fr; padding: 30px; }
      .movie-poster { display: none; }
      .movie-title { font-size: 2rem; }
    }
  `]
})
export class MovieDetailModalComponent implements OnInit {
  @Input() movie!: MovieItem;
  @Output() close = new EventEmitter<void>();

  providers: WatchProvider[] = [];
  credits: { director: string; cast: string[]; runtime: number } | null = null;
  loadingProviders = true;
  feedbackSent = false;
  isInWatchlist = false;

  constructor(
    private moviesService: MoviesService,
    private watchlistService: WatchlistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadingProviders = true;
    this.moviesService.getMovieProviders(this.movie.id).subscribe({
      next: (providers) => {
        this.providers = providers;
        this.loadingProviders = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingProviders = false;
        this.cdr.detectChanges();
      }
    });

    this.moviesService.getMovieCredits(this.movie.id).subscribe({
      next: (credits) => {
        this.credits = credits;
        this.cdr.detectChanges();
      }
    });

    this.watchlistService.watchlist$.subscribe(list => {
      this.isInWatchlist = list.some(m => m.id === this.movie.id);
      this.cdr.detectChanges();
    });
  }

  onClose() {
    this.close.emit();
  }

  toggleWatchlist() {
    if (this.isInWatchlist) {
      this.watchlistService.removeFromWatchlist(this.movie.id);
    } else {
      this.watchlistService.addToWatchlist(this.movie);
    }
  }

  giveFeedback(type: 'like' | 'dislike') {
    this.feedbackSent = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.onClose();
    }, 1500);
  }

  onShare() {
    const shareData = {
      title: `CineMatch - ${this.movie.title}`,
      text: `Regarde ce film sur CineMatch : ${this.movie.overview}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        this.copyToClipboard(shareData.url);
      });
    } else {
      this.copyToClipboard(shareData.url);
    }
  }

  private copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert('Lien copié dans le presse-papier !');
  }

  formatRuntime(minutes: number): string {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }
}
