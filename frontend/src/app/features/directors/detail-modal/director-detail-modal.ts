import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cm-director-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">✕</button>
        
        <div class="modal-body">
          <div class="director-header">
            <div class="director-image">
              <img [src]="director.image || 'https://api.dicebear.com/7.x/initials/svg?seed=' + director.name" [alt]="director.name">
            </div>
            <div class="director-info">
              <h1>{{ director.name }}</h1>
              <div class="meta-info">
                <span *ngIf="director.birthday">Né(e) le : {{ director.birthday | date:'longDate':'':'fr' }}</span>
                <span *ngIf="director.deathday" class="death">Décédé(e) le : {{ director.deathday | date:'longDate':'':'fr' }}</span>
                <span *ngIf="director.placeOfBirth">{{ director.placeOfBirth }}</span>
              </div>
              <div class="bio-section">
                <h3>Biographie</h3>
                <p [class.expanded]="isBioExpanded">
                  {{ director.biography || 'Aucune biographie disponible pour ce réalisateur.' }}
                </p>
                <button *ngIf="director.biography?.length > 300" class="show-more" (click)="isBioExpanded = !isBioExpanded">
                  {{ isBioExpanded ? 'Voir moins' : 'Lire la suite' }}
                </button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="view-movies-btn" (click)="onViewMovies()">
              <span class="icon">🎬</span>
              Voir ses films
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.3s ease-out;
    }

    .modal-content {
      background: #0a0e14;
      width: 90%;
      max-width: 1100px;
      max-height: 90vh;
      border-radius: 24px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 180, 0, 0.2);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .close-btn {
      position: absolute;
      top: 25px;
      right: 25px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 10;
      transition: all 0.3s;
    }

    .close-btn:hover {
      background: #ffb400;
      color: #05080f;
      transform: rotate(90deg);
    }

    .modal-body {
      padding: 60px;
      overflow-y: auto;
      max-height: 90vh;
    }

    .director-header {
      display: flex;
      gap: 60px;
      align-items: flex-start;
    }

    .director-image {
      flex-shrink: 0;
      width: 350px;
      aspect-ratio: 1/1;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid rgba(255, 180, 0, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    .director-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .director-info {
      flex-grow: 1;
    }

    .director-info h1 {
      font-size: 3.5rem;
      font-family: 'Playfair Display', serif;
      margin-bottom: 15px;
      color: white;
    }

    .meta-info {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 30px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
    }

    .meta-info span {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .death {
      color: #ff4d4d;
    }

    .bio-section h3 {
      font-size: 1.2rem;
      color: #ffb400;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .bio-section p {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.7;
      font-size: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 8;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: all 0.5s;
    }

    .bio-section p.expanded {
      -webkit-line-clamp: unset;
    }

    .show-more {
      background: transparent;
      border: none;
      color: #ffb400;
      padding: 0;
      margin-top: 10px;
      cursor: pointer;
      font-weight: 600;
      text-decoration: underline;
    }

    .modal-footer {
      margin-top: 50px;
      display: flex;
      justify-content: flex-end;
    }

    .view-movies-btn {
      background: #ffb400;
      color: #05080f;
      border: none;
      padding: 15px 35px;
      border-radius: 30px;
      font-size: 1rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 20px rgba(255, 180, 0, 0.2);
    }

    .view-movies-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 15px 30px rgba(255, 180, 0, 0.4);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* Scrollbar personnalisée */
    .modal-body::-webkit-scrollbar {
      width: 6px;
    }
    .modal-body::-webkit-scrollbar-track {
      background: transparent;
    }
    .modal-body::-webkit-scrollbar-thumb {
      background: rgba(255, 180, 0, 0.3);
      border-radius: 10px;
    }
  `]
})
export class DirectorDetailModalComponent {
  @Input() director: any;
  @Output() close = new EventEmitter<void>();
  @Output() viewMovies = new EventEmitter<number>();

  isBioExpanded = false;

  onClose() {
    this.close.emit();
  }

  onViewMovies() {
    this.viewMovies.emit(this.director.id);
  }
}
