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
    // On ne garde que les 4 premiers chiffres de l'année (au cas où on reçoit une date complète)
    const normalizedYear = year?.toString().substring(0, 4);

    const isMatch = this.watchedFilms.some(f => {
      const watchedTitle = f.title.trim().toLowerCase();
      const watchedYear = f.year.toString().substring(0, 4);
      return watchedTitle === normalizedTitle && watchedYear === normalizedYear;
    });

    if (isMatch) {
      console.log(`[WatchedService] Film filtré car déjà vu: ${title} (${normalizedYear})`);
    }

    return isMatch;
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
      
      // Regex pour spliter par virgule en ignorant celles à l'intérieur des guillemets
      const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      
      if (parts && parts.length >= 3) {
        // Nettoyage des guillemets et espaces
        const title = parts[1].replace(/^"|"$/g, '').trim();
        const year = parts[2].trim();
        
        if (title && year) {
          newFilms.push({ title, year });
        }
      }
    }

    this.watchedFilms = newFilms;
    this.saveToStorage();
    return this.getCount();
  }

  reset(): void {
    this.watchedFilms = [];
    localStorage.removeItem(this.STORAGE_KEY);
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
}
