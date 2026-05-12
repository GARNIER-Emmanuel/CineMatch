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
          Réinitialiser
        </button>
      </div>

      <div class="filters-grid">
        <!-- Section Genres & Plateformes -->
        <div class="filter-group main-group">
          <!-- Genres -->
          <div class="sub-group">
            <label class="group-label">Genres</label>
            <div class="genres-chips">
              @for (genre of genres; track genre.id) {
                <button 
                  class="chip" 
                  [class.active]="selectedGenreIds.includes(genre.id)"
                  [attr.data-test]="'genre-' + genre.id"
                  (click)="selectGenre(genre.id)">
                  {{ genre.name }}
                </button>
              }
            </div>

            <!-- Sous-filtre Romance (Conditionnel) -->
            <div class="romance-subfilter" *ngIf="isRomanceActive">
              <span class="sub-label">Romance :</span>
              <div class="toggle-group">
                <button 
                  class="toggle-btn" 
                  [class.active]="romanceMode === 'family'"
                  (click)="setRomanceMode('family')">
                  ● Grand public
                </button>
                <button 
                  class="toggle-btn" 
                  [class.active]="romanceMode === 'all'"
                  (click)="setRomanceMode('all')">
                  ○ Tout accepter
                </button>
              </div>
            </div>
          </div>

          <!-- Plateformes -->
          <div class="sub-group providers-section">
            <label class="group-label">Plateformes</label>
            <div class="providers-chips">
              @for (provider of providers; track provider.id) {
                <button 
                  class="provider-chip" 
                  [class.active]="selectedProviderIds.includes(provider.id)"
                  [attr.data-test]="'provider-' + provider.id"
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
              <label class="group-label">Durée max</label>
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
              class="modern-slider"
              data-test="duration-slider">
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
      padding: 25px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(20, 20, 20, 0.6);
      backdrop-filter: blur(10px);
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .spacer {
      flex: 1;
    }

    .reset-link {
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
      opacity: 0.8;
      transition: opacity 0.3s;
    }

    .reset-link:hover {
      opacity: 1;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 40px;
    }

    @media (max-width: 900px) {
      .filters-grid {
        grid-template-columns: 1fr;
        gap: 25px;
      }
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .main-group {
      gap: 30px;
    }

    .sub-group {
      display: flex;
      flex-direction: column;
    }

    .group-label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 15px;
      font-weight: 600;
    }

    .genres-chips, .providers-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .chip, .provider-chip {
      padding: 6px 14px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }

    .chip:hover, .provider-chip:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
    }

    .provider-chip.active {
      background: #0070f3; /* Bleu premium pour les plateformes */
      border-color: #0070f3;
      color: white;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 112, 243, 0.3);
    }

    .romance-subfilter {
      margin-top: 15px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
    }

    .sub-label {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
    }

    .toggle-group {
      display: flex;
      gap: 10px;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.8rem;
      cursor: pointer;
      padding: 2px 0;
    }

    .toggle-btn.active {
      color: white;
      font-weight: 700;
    }

    .sliders-group {
      gap: 25px;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .value-badge {
      font-size: 0.9rem;
      color: white;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .modern-slider {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      outline: none;
    }

    .modern-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      background: white;
      border: 3px solid var(--primary-color);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s;
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
  romanceMode: 'family' | 'all' = 'family';

  genres: Genre[] = [
    { id: '28', name: 'Action' },
    { id: '12', name: 'Aventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comédie' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentaire' },
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

  get isRomanceActive(): boolean {
    return this.selectedGenreIds.includes('10749');
  }

  selectGenre(id: string): void {
    const index = this.selectedGenreIds.indexOf(id);
    if (index > -1) {
      this.selectedGenreIds.splice(index, 1);
      if (id === '10749') this.romanceMode = 'family';
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

  setRomanceMode(mode: 'family' | 'all'): void {
    this.romanceMode = mode;
    this.emitAllFilters();
  }

  private emitAllFilters(): void {
    // Genres (ET logique : virgule)
    const genresParam = this.selectedGenreIds.length > 0 ? this.selectedGenreIds.join(',') : null;
    this.genreChange.emit(genresParam);

    // Plateformes (OU logique : barre verticale)
    const providersParam = this.selectedProviderIds.length > 0 ? this.selectedProviderIds.join('|') : null;
    this.providerChange.emit(providersParam);

    // Certifications
    if (this.isRomanceActive && this.romanceMode === 'family') {
      this.certificationChange.emit({ country: 'FR', lte: '12' });
    } else {
      this.certificationChange.emit(null);
    }
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
    this.romanceMode = 'family';
    
    this.genreChange.emit(null);
    this.providerChange.emit(null);
    this.durationChange.emit(240);
    this.certificationChange.emit(null);
  }

  hasActiveFilters(): boolean {
    return this.selectedGenreIds.length > 0 || this.selectedProviderIds.length > 0 || this.maxDuration !== 240;
  }
}
