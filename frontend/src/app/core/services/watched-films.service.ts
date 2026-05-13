import { Injectable } from '@angular/core';

export interface WatchedFilm {
  title: string;
  year: string;
}

@Injectable({
  providedIn: 'root'
})
export class WatchedFilmsService {
  private watchedFilms: WatchedFilm[] = [];

  constructor() {}

  isWatched(title: string, year: string): boolean {
    if (!title) return false;
    
    const normalizedTitle = title.trim().toLowerCase();
    return this.watchedFilms.some(f => 
      f.title.trim().toLowerCase() === normalizedTitle && 
      f.year === year
    );
  }

  getCount(): number {
    return this.watchedFilms.length;
  }

  async importFromCSV(file: File): Promise<number> {
    return 0; // RED
  }

  private saveToStorage(): void {}

  private loadFromStorage(): void {}

  // Méthode temporaire pour le test
  private addFilmManually(title: string, year: string) {
    this.watchedFilms.push({ title, year });
  }
}
