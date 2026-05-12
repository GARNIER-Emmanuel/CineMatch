import { Component, Input, Output, EventEmitter, HostListener, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieItem } from '../../home/movie-row/movie-row';
import { MoviesService, WatchProvider } from '../../../core/services/movies';

@Component({
  selector: 'cm-movie-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()">
      <div class="modal-container glass" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">×</button>
        
        <div class="modal-content">
          <div class="poster-side">
            <img [src]="movie?.poster" [alt]="movie?.title">
          </div>
          
          <div class="info-side">
            <div class="header-info">
              <div class="meta-row">
                <span class="rating-badge">★ {{ formatRating(movie?.rating) }}</span>
                <div class="vote-actions" *ngIf="!hasVoted">
                  <button class="vote-btn like" (click)="onVote(true)" title="J'aime">👍</button>
                  <button class="vote-btn dislike" (click)="onVote(false)" title="Pas pour moi">👎</button>
                </div>
                <span class="vote-feedback" *ngIf="hasVoted">Merci pour votre avis !</span>
              </div>
              <h2 class="title">{{ movie?.title }}</h2>
            </div>

            <!-- Plateformes -->
            <div class="providers-container">
              <h3>Disponible sur</h3>
              <div class="providers-list">
                @if (loadingProviders) {
                  <div class="loader-small"></div>
                } @else if (providers.length > 0) {
                  @for (p of providers; track p.id) {
                    <div class="provider-item" [title]="p.name">
                      <img [src]="p.logo" [alt]="p.name">
                    </div>
                  }
                } @else {
                  <span class="no-providers">Non disponible en streaming (FR)</span>
                }
              </div>
            </div>

            <div class="synopsis-container">
              <h3>Synopsis</h3>
              <p class="synopsis">{{ movie?.overview || 'Aucun synopsis disponible pour ce film.' }}</p>
            </div>

            <div class="actions">
              <button class="play-btn">
                <span class="play-icon">▶</span> Lecture
              </button>
              <button class="list-btn">+ Ma Liste</button>
              <button class="share-btn" (click)="onShare()">
                <span class="share-icon">{{ shareStatus === 'copied' ? '✅' : '🔗' }}</span>
                {{ shareStatus === 'copied' ? 'Copié !' : 'Partager' }}
              </button>
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
      background: rgba(0, 0, 0, 0.7);
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
      max-width: 900px;
      background: #181818;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .close-btn {
      position: absolute;
      top: 15px;
      right: 20px;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      z-index: 10;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      display: flex;
      flex-direction: row;
      min-height: 550px;
    }

    .poster-side {
      flex: 0 0 350px;
      background: #000;
    }

    .poster-side img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .info-side {
      flex: 1;
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 10px;
    }

    .vote-actions {
      display: flex;
      gap: 8px;
    }

    .vote-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .vote-feedback {
      font-size: 0.85rem;
      color: #46d369;
      font-weight: 600;
      animation: slideInRight 0.3s ease-out;
    }

    .title {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 0;
    }

    .rating-badge {
      color: #46d369;
      font-weight: 800;
    }

    .providers-container h3, .synopsis-container h3 {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 12px;
      font-weight: 700;
    }

    .providers-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      min-height: 45px;
      align-items: center;
    }

    .provider-item img {
      width: 45px;
      height: 45px;
      border-radius: 8px;
    }

    .synopsis {
      font-size: 1rem;
      line-height: 1.6;
      color: #d2d2d2;
      max-height: 150px;
      overflow-y: auto;
    }

    .actions {
      margin-top: auto;
      display: flex;
      gap: 12px;
      padding-top: 20px;
      flex-wrap: wrap;
    }

    .play-btn {
      background: white;
      color: black;
      padding: 10px 25px;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      border: none;
    }

    .list-btn, .share-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .share-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: white;
    }

    .loader-small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }

    @media (max-width: 800px) {
      .modal-content { flex-direction: column; }
      .poster-side { flex: 0 0 200px; }
      .info-side { padding: 25px; }
      .actions { gap: 8px; }
    }
  `]
})
export class MovieDetailModalComponent implements OnInit {
  private moviesService = inject(MoviesService);
  private cdr = inject(ChangeDetectorRef);

  @Input() movie: MovieItem | null = null;
  @Output() close = new EventEmitter<void>();

  providers: WatchProvider[] = [];
  loadingProviders = true;
  hasVoted = false;
  shareStatus: 'idle' | 'copied' = 'idle';

  ngOnInit(): void {
    if (this.movie) {
      this.fetchProviders(this.movie.id);
    }
  }

  fetchProviders(movieId: number): void {
    this.loadingProviders = true;
    this.moviesService.getMovieProviders(movieId).subscribe({
      next: (data) => {
        this.providers = data;
        this.loadingProviders = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingProviders = false;
        this.cdr.detectChanges();
      }
    });
  }

  onVote(isLike: boolean): void {
    console.log(`Vote ${isLike ? 'positif' : 'négatif'} pour ${this.movie?.title}`);
    this.hasVoted = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.onClose();
    }, 1500);
  }

  /**
   * Partage du film via Web Share API ou Copier le lien
   */
  async onShare(): Promise<void> {
    if (!this.movie) return;

    const shareData = {
      title: `CineMatch - ${this.movie.title}`,
      text: `J'ai trouvé ce film sur CineMatch : "${this.movie.title}". Ça te tente pour ce soir ?`,
      url: `https://www.themoviedb.org/movie/${this.movie.id}`
    };

    try {
      // Tentative Web Share API (Mobile / Safari)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback : Copie dans le presse-papier
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        this.shareStatus = 'copied';
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.shareStatus = 'idle';
          this.cdr.detectChanges();
        }, 2000);
      }
    } catch (err) {
      console.error('Erreur lors du partage:', err);
    }
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  formatRating(rating: string | undefined): string {
    if (!rating) return '0.0';
    const val = parseFloat(rating);
    return isNaN(val) ? '0.0' : val.toFixed(1);
  }
}
