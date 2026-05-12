import { Injectable } from '@angular/core';

export interface SessionProfile {
  likedGenres: Record<number, number>;    // genreId -> nombre de likes
  dislikedGenres: Record<number, number>; // genreId -> nombre de dislikes
}

@Injectable({
  providedIn: 'root',
})
export class CineScrollProfileService {
  private profile: SessionProfile = this.getInitialProfile();

  constructor() {}

  /**
   * Enregistre un like sur une liste de genres
   */
  like(genreIds: number[]): void {
    genreIds.forEach(id => {
      this.profile.likedGenres[id] = (this.profile.likedGenres[id] || 0) + 1;
    });
  }

  /**
   * Enregistre un dislike sur une liste de genres
   */
  dislike(genreIds: number[]): void {
    genreIds.forEach(id => {
      this.profile.dislikedGenres[id] = (this.profile.dislikedGenres[id] || 0) + 1;
    });
  }

  /**
   * Retourne les IDs de genres préférés (seuil : 2 likes)
   */
  getPreferredGenres(): number[] {
    return Object.entries(this.profile.likedGenres)
      .filter(([_, count]) => count >= 2)
      .map(([id, _]) => Number(id));
  }

  /**
   * Retourne les IDs de genres à exclure (seuil : 3 dislikes)
   */
  getExcludedGenres(): number[] {
    return Object.entries(this.profile.dislikedGenres)
      .filter(([_, count]) => count >= 3)
      .map(([id, _]) => Number(id));
  }

  /**
   * Réinitialise le profil de session
   */
  reset(): void {
    this.profile = this.getInitialProfile();
  }

  private getInitialProfile(): SessionProfile {
    return {
      likedGenres: {},
      dislikedGenres: {},
    };
  }
}
