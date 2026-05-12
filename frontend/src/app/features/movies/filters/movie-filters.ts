import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Genre {
  id: string;
  name: string;
}

export interface Certification {
  country: string;
  lte: string;
}

export interface Provider {
  id: string;
  name: string;
  icon?: string;
}

@Component({
  selector: 'cm-movie-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-card glass">
      <div class="filters-header" *ngIf="hasActiveFilters()">
        <div class="spacer"></div>
        <button class="reset-link" (click)="resetFilters()">
          Réinitialiser la sélection
        </button>
      </div>

      <div class="filters-grid">
        <!-- Section Genres & Plateformes -->
        <div class="filter-group main-group">
          <!-- Genres -->
          <div class="sub-group">
            <label class="group-label">Genres Cinématographiques</label>
            <div class="genres-chips">
              @for (genre of genres; track genre.id) {
                <button 
                  class="chip" 
                  [class.active]="selectedGenreIds.includes(genre.id)"
                  (click)="selectGenre(genre.id)">
                  {{ genre.name }}
                </button>
              }
            </div>
          </div>

          <!-- Plateformes -->
          <div class="sub-group providers-section">
            <label class="group-label">Diffuseurs & Streaming</label>
            <div class="providers-chips">
              @for (provider of providers; track provider.id) {
                <button 
                  class="provider-chip" 
                  [class.active]="selectedProviderIds.includes(provider.id)"
                  (click)="selectProvider(provider.id)">
                  {{ provider.name }}
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Section Sliders -->
        <div class="filter-group sliders-group">
          <div class="slider-control">
            <div class="slider-header">
              <label class="group-label">Durée de la séance</label>
              <span class="value-badge">{{ maxDuration }} min</span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="240" 
              step="15" 
              [(ngModel)]="maxDuration"
              (input)="onDurationInput($event)"
              (change)="emitDurationChange()"
              class="modern-slider">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin: 20px var(--container-padding);
    }

    .filters-card {
      padding: 30px;
      border-radius: 16px;
      border: 1px solid rgba(255, 180, 0, 0.1);
      background: rgba(10, 14, 26, 0.7);
      backdrop-filter: blur(15px);
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .reset-link {
      background: none;
      border: none;
      color: #ffb400;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: underline;
      opacity: 0.8;
      transition: opacity 0.3s;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .reset-link:hover {
      opacity: 1;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: 50px;
    }

    @media (max-width: 900px) {
      .filters-grid { grid-template-columns: 1fr; gap: 30px; }
    }

    .group-label {
      font-family: 'Playfair Display', serif;
      font-size: 1rem;
      color: white;
      margin-bottom: 18px;
      font-weight: 700;
      display: block;
    }

    .genres-chips, .providers-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .chip, .provider-chip {
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .chip:hover, .provider-chip:hover {
      background: rgba(255, 180, 0, 0.1);
      border-color: rgba(255, 180, 0, 0.3);
      color: white;
    }

    .chip.active, .provider-chip.active {
      background: #ffb400;
      border-color: #ffb400;
      color: #05080f;
      font-weight: 700;
      box-shadow: 0 4px 15px rgba(255, 180, 0, 0.4);
    }

    .sliders-group {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .value-badge {
      font-size: 0.9rem;
      color: #ffb400;
      font-weight: 800;
      background: rgba(255, 180, 0, 0.1);
      padding: 4px 12px;
      border-radius: 12px;
    }

    .modern-slider {
      width: 100%;
      height: 4px;
      -webkit-appearance: none;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      outline: none;
    }

    .modern-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      background: #ffb400;
      border: 4px solid #05080f;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(255, 180, 0, 0.5);
      transition: transform 0.2s;
    }

    .modern-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
  `]
})
export class MovieFiltersComponent {
  @Output() genreChange = new EventEmitter<string | null>();
  @Output() durationChange = new EventEmitter<number>();
  @Output() certificationChange = new EventEmitter<Certification | null>();
  @Output() providerChange = new EventEmitter<string | null>();

  selectedGenreIds: string[] = [];
  selectedProviderIds: string[] = [];
  maxDuration: number = 240;

  genres: Genre[] = [
    { id: '28', name: 'Action' },
    { id: '12', name: 'Aventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comédie' },
    { id: '80', name: 'Crime' },
    { id: '18', name: 'Drame' },
    { id: '14', name: 'Fantastique' },
    { id: '27', name: 'Horreur' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Science-Fiction' },
    { id: '53', name: 'Thriller' }
  ];

  providers: Provider[] = [
    { id: '8', name: 'Netflix' },
    { id: '337', name: 'Disney+' },
    { id: '119', name: 'Amazon Prime' },
    { id: '381', name: 'Canal+' },
    { id: '2', name: 'Apple TV' }
  ];

  selectGenre(id: string): void {
    const index = this.selectedGenreIds.indexOf(id);
    if (index > -1) {
      this.selectedGenreIds.splice(index, 1);
    } else {
      this.selectedGenreIds.push(id);
    }
    this.emitAllFilters();
  }

  selectProvider(id: string): void {
    const index = this.selectedProviderIds.indexOf(id);
    if (index > -1) {
      this.selectedProviderIds.splice(index, 1);
    } else {
      this.selectedProviderIds.push(id);
    }
    this.emitAllFilters();
  }

  private emitAllFilters(): void {
    const genresParam = this.selectedGenreIds.length > 0 ? this.selectedGenreIds.join(',') : null;
    this.genreChange.emit(genresParam);

    const providersParam = this.selectedProviderIds.length > 0 ? this.selectedProviderIds.join('|') : null;
    this.providerChange.emit(providersParam);

    // Simplification des certifications pour la DA Cinema
    this.certificationChange.emit(null);
  }

  onDurationInput(event: Event): void {
    this.maxDuration = parseInt((event.target as HTMLInputElement).value, 10);
  }

  emitDurationChange(): void {
    this.durationChange.emit(this.maxDuration);
    this.emitAllFilters();
  }

  resetFilters(): void {
    this.selectedGenreIds = [];
    this.selectedProviderIds = [];
    this.maxDuration = 240;
    
    this.genreChange.emit(null);
    this.providerChange.emit(null);
    this.durationChange.emit(240);
    this.certificationChange.emit(null);
  }

  hasActiveFilters(): boolean {
    return this.selectedGenreIds.length > 0 || this.selectedProviderIds.length > 0 || this.maxDuration !== 240;
  }
}
