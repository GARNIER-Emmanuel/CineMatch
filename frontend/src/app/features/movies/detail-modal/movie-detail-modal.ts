import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieItem } from '../../home/movie-row/movie-row';

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
              <span class="rating-badge">★ {{ formatRating(movie?.rating) }}</span>
              <h2 class="title">{{ movie?.title }}</h2>
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
      transition: background 0.2s;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .modal-content {
      display: flex;
      flex-direction: row;
      min-height: 500px;
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
      gap: 25px;
    }

    .rating-badge {
      display: inline-block;
      color: #46d369;
      font-weight: 800;
      font-size: 1.1rem;
      margin-bottom: 10px;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      line-height: 1.1;
    }

    .synopsis-container h3 {
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 10px;
    }

    .synopsis {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #d2d2d2;
      max-height: 200px;
      overflow-y: auto;
    }

    .actions {
      margin-top: auto;
      display: flex;
      gap: 15px;
    }

    .play-btn {
      background: white;
      color: black;
      border: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: opacity 0.2s;
    }

    .play-btn:hover {
      background: #e6e6e6;
    }

    .list-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 12px 25px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .list-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    @media (max-width: 800px) {
      .modal-content {
        flex-direction: column;
      }
      .poster-side {
        flex: 0 0 250px;
      }
      .title {
        font-size: 1.8rem;
      }
    }
  `]
})
export class MovieDetailModalComponent {
  @Input() movie: MovieItem | null = null;
  @Output() close = new EventEmitter<void>();

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
