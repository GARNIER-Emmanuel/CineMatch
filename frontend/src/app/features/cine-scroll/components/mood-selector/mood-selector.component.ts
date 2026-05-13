import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CineScrollProfileService } from '../../../../core/services/cine-scroll-profile';

export interface Mood {
  id: string;
  label: string;
  emoji: string;
  genres: string;
  releaseYearMin?: number;
  releaseYearMax?: number;
}

@Component({
  selector: 'cm-mood-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mood-container">
      <h1 class="title">Comment vous sentez-vous ?</h1>
      <p class="subtitle">Choisissez un mood pour lancer votre séance CineScroll</p>

      <div class="mood-grid">
        @for (mood of moods; track mood.id) {
          <div class="mood-card glass" (click)="onMoodSelect(mood)">
            <span class="emoji">{{ mood.emoji }}</span>
            <span class="label">{{ mood.label }}</span>
            <div class="glow"></div>
          </div>
        }
      </div>

      <button class="skip-btn" (click)="onSkip()">
        Ou laissez le destin choisir...
      </button>

      <button class="reset-profile-btn" (click)="onResetProfile()" *ngIf="hasProfile">
        Réinitialiser mes préférences de session
      </button>
    </div>
  `,
  styles: [`
    .mood-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      padding: 20px;
      animation: fadeIn 0.8s ease-out;
    }

    .title {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      margin-bottom: 10px;
      text-align: center;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin-bottom: 50px;
      text-align: center;
    }

    .mood-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 25px;
      width: 100%;
      max-width: 900px;
    }

    .mood-card {
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 16px;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    .mood-card:hover {
      transform: translateY(-10px);
      border-color: var(--primary-color);
      box-shadow: 0 15px 40px rgba(255, 180, 0, 0.2);
    }

    .emoji {
      font-size: 3.5rem;
      margin-bottom: 15px;
      filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
    }

    .label {
      font-weight: 700;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .skip-btn {
      margin-top: 60px;
      background: none;
      border: none;
      color: var(--primary-color);
      font-weight: 700;
      font-size: 1rem;
      text-decoration: underline;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.3s;
    }

    .skip-btn:hover {
      opacity: 1;
    }

    .reset-profile-btn {
      margin-top: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.4);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .reset-profile-btn:hover {
      background: rgba(255, 59, 48, 0.1);
      color: #ff3b30;
      border-color: rgba(255, 59, 48, 0.3);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 600px) {
      .mood-grid { grid-template-columns: repeat(2, 1fr); }
      .title { font-size: 2rem; }
    }
  `]
})
export class MoodSelectorComponent {
  @Output() moodSelect = new EventEmitter<Mood>();
  @Output() skip = new EventEmitter<void>();

  constructor(private profileService: CineScrollProfileService) {}

  get hasProfile(): boolean {
    return this.profileService.getPreferredGenres().length > 0 || 
           this.profileService.getExcludedGenres().length > 0;
  }

  moods: Mood[] = [
    { id: 'happy', label: 'Bonne humeur', emoji: '😂', genres: '35,16' },
    { id: 'melancholy', label: 'Mélancolique', emoji: '😢', genres: '18,10749' },
    { id: 'thrills', label: 'Frissons', emoji: '😱', genres: '27,53' },
    { id: 'adventure', label: 'Dépaysement', emoji: '🤯', genres: '878,12' },
    { id: 'romantic', label: 'Romantique', emoji: '❤️', genres: '10749,18' },
    { id: 'thinking', label: 'Réflexion', emoji: '🧠', genres: '18,878' },
    { id: 'auteur', label: "Cinéma d'auteur", emoji: '🎥', genres: '18,36' },
    { id: 'classic', label: 'Classique', emoji: '🎞️', genres: '', releaseYearMax: 1985 }
  ];

  onMoodSelect(mood: Mood): void {
    this.moodSelect.emit(mood);
  }

  onSkip(): void {
    this.skip.emit();
  }

  onResetProfile(): void {
    if (confirm('Voulez-vous vraiment réinitialiser vos préférences de recommandation ?')) {
      this.profileService.reset();
    }
  }
}
