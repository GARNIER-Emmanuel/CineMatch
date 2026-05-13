import { Injectable } from '@angular/core';

export interface WatchedFilm {
  title: string;
  year: string;
}

@Injectable({
  providedIn: 'root'
})
export class WatchedFilmsService {
  private readonly STORAGE_KEY = 'cinematch_watched_films';
  private watchedFilms: WatchedFilm[] = [];

  constructor() {
    this.loadFromStorage();
  }

  isWatched(title: string, year: string): boolean {
    if (!title) return false;
    
    const normalizedTitle = title.trim().toLowerCase();
    return this.watchedFilms.some(f => 
      f.title.trim().toLowerCase() === normalizedTitle && 
      f.year.toString() === year?.toString()
    );
  }

  getCount(): number {
    return this.watchedFilms.length;
  }

  async importFromCSV(file: File): Promise<number> {
    const text = await file.text();
    const lines = text.split(/\r?\n/);
    
    // On ignore l'en-tête
    const movieLines = lines.slice(1);
    const newFilms: WatchedFilm[] = [];

    for (const line of movieLines) {
      if (!line.trim()) continue;
      
      const parts = line.split(',');
      if (parts.length >= 3) {
        const title = parts[1].replace(/"/g, ''); // On enlève les guillemets éventuels
        const year = parts[2];
        newFilms.push({ title, year });
      }
    }

    this.watchedFilms = newFilms;
    this.saveToStorage();
    return this.getCount();
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.watchedFilms));
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.watchedFilms = JSON.parse(stored);
      } catch (e) {
        console.error('Erreur lors du chargement des films vus:', e);
        this.watchedFilms = [];
      }
    }
  }

  // Méthode temporaire pour le test
  private addFilmManually(title: string, year: string) {
    this.watchedFilms.push({ title, year });
  }
}
