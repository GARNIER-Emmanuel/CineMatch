import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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
  
  // Sujet pour notifier les composants de rafraîchir leurs données
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  notifyRefresh() {
    this.refreshSubject.next();
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
    if (lines.length === 0) return 0;
    
    // 1. Lire l'en-tête pour trouver les indices des colonnes
    const headers = this.parseCsvLine(lines[0]).map(h => h.toLowerCase());
    let nameIndex = headers.indexOf('name');
    let yearIndex = headers.indexOf('year');
    
    // Fallback au cas où l'en-tête est absent ou inattendu
    if (nameIndex === -1) nameIndex = 1;
    if (yearIndex === -1) yearIndex = 2;

    const movieLines = lines.slice(1);
    const newFilms: WatchedFilm[] = [];

    for (const line of movieLines) {
      if (!line.trim()) continue;
      
      const parts = this.parseCsvLine(line);
      
      if (parts && parts.length > Math.max(nameIndex, yearIndex)) {
        const title = parts[nameIndex];
        const year = parts[yearIndex];
        
        if (title && year) {
          newFilms.push({ title, year });
        }
      }
    }

    this.watchedFilms = newFilms;
    this.saveToStorage();
    return this.getCount();
  }

  // Parseur manuel robuste pour gérer les virgules dans les guillemets et les espaces
  private parseCsvLine(line: string): string[] {
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // Enlève les guillemets résiduels si besoin
        parts.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim().replace(/^"|"$/g, ''));
    return parts;
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
