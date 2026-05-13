import { Injectable } from '@angular/core';

export interface SessionProfile {
  likedGenres: Record<number, number>;    // genreId -> nombre de likes
  dislikedGenres: Record<number, number>; // genreId -> nombre de dislikes
  likedPeople: Record<string, number>;    // nom (réal/acteur) -> nombre de likes
}

@Injectable({
  providedIn: 'root',
})
export class CineScrollProfileService {
  private readonly STORAGE_KEY = 'cinematch_cinescroll_profile';
  private profile: SessionProfile = this.loadFromStorage();

  constructor() {}

  /**
   * Enregistre un like sur une liste de genres avec un poids (multiplicateur)
   */
  like(genreIds: number[], weight: number = 1): void {
    genreIds.forEach(id => {
      this.profile.likedGenres[id] = (this.profile.likedGenres[id] || 0) + weight;
    });
    this.saveToStorage();
  }

  /**
   * Enregistre un dislike sur une liste de genres
   */
  dislike(genreIds: number[], weight: number = 1): void {
    genreIds.forEach(id => {
      this.profile.dislikedGenres[id] = (this.profile.dislikedGenres[id] || 0) + weight;
    });
    this.saveToStorage();
  }

  /**
   * Enregistre un intérêt pour des personnes (réalisateur / acteurs)
   */
  likePeople(names: string[]): void {
    names.forEach(name => {
      if (!name) return;
      this.profile.likedPeople[name] = (this.profile.likedPeople[name] || 0) + 1;
    });
    this.saveToStorage();
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
    this.saveToStorage();
  }

  /**
   * Récupère le profil complet de la session
   */
  getProfile(): SessionProfile {
    return this.profile;
  }

  private loadFromStorage(): SessionProfile {
    if (typeof localStorage === 'undefined') return this.getInitialProfile();
    const data = localStorage.getItem(this.STORAGE_KEY);
    const profile = data ? JSON.parse(data) : this.getInitialProfile();
    
    // Assurer que tous les champs existent (Migration suite à mise à jour)
    return {
      ...this.getInitialProfile(),
      ...profile
    };
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.profile));
  }

  private getInitialProfile(): SessionProfile {
    return {
      likedGenres: {},
      dislikedGenres: {},
      likedPeople: {},
    };
  }
}
