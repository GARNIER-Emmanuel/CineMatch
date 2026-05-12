import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Genre {
  id: string;
  name: string;
}

@Component({
  selector: 'cm-movie-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-card glass">
      <div class="filters-header">
        <h2 class="title">Filtres Dynamiques</h2>
        <button class="reset-link" (click)="resetFilters()" *ngIf="hasActiveFilters()">
          Réinitialiser
        </button>
      </div>

      <div class="filters-grid">
        <!-- Section Genres -->
        <div class="filter-group genres-group">
          <label class="group-label">Genres</label>
          <div class="genres-chips">
            @for (genre of genres; track genre.id) {
              <button 
                class="chip" 
                [class.active]="selectedGenreId === genre.id"
                [attr.data-test]="'genre-' + genre.id"
                (click)="selectGenre(genre.id)">
                {{ genre.name }}
              </button>
            }
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
      margin-bottom: 25px;
    }

    .title {
      font-size: 1.2rem;
      font-weight: 700;
      color: white;
      margin: 0;
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

    .group-label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 15px;
      font-weight: 600;
    }

    .genres-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .chip {
      padding: 6px 14px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }

    .chip:hover {
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

    .modern-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
  `]
})
export class MovieFiltersComponent {
  @Output() genreChange = new EventEmitter<string | null>();
  @Output() durationChange = new EventEmitter<number>();

  selectedGenreId: string | null = null;
  maxDuration: number = 240;

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

  selectGenre(id: string): void {
    if (this.selectedGenreId === id) {
      this.selectedGenreId = null;
    } else {
      this.selectedGenreId = id;
    }
    this.genreChange.emit(this.selectedGenreId);
  }

  onDurationInput(event: Event): void {
    this.maxDuration = parseInt((event.target as HTMLInputElement).value, 10);
  }

  emitDurationChange(): void {
    this.durationChange.emit(this.maxDuration);
  }

  resetFilters(): void {
    this.selectedGenreId = null;
    this.maxDuration = 240;
    
    this.genreChange.emit(null);
    this.durationChange.emit(240);
  }

  hasActiveFilters(): boolean {
    return this.selectedGenreId !== null || this.maxDuration !== 240;
  }
}
