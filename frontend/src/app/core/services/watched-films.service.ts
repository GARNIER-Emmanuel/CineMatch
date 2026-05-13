import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface WatchedFilm {
  title: string;
  year: string;
  normalizedTitle: string; // Pré-calculé pour la performance
  normalizedYear: number;
}

@Injectable({
  providedIn: 'root'
})
export class WatchedFilmsService {
  private readonly STORAGE_KEY = 'cinematch_watched_films';
  private watchedFilms: WatchedFilm[] = [];
  
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  // Utilitaire interne de normalisation
  private normalizeStr(str: string): string {
    if (!str) return '';
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '')
              .trim();
  }

  notifyRefresh() {
    this.refreshSubject.next();
  }

  isWatched(title: string, year: string, originalTitle?: string): boolean {
    if (!title) return false;
    
    const nTitle = this.normalizeStr(title);
    const nOriginal = originalTitle ? this.normalizeStr(originalTitle) : null;
    const nYear = parseInt(year?.toString().substring(0, 4), 10);

    return this.watchedFilms.some(f => {
      // On compare avec les champs déjà normalisés
      const titleMatches = (f.normalizedTitle === nTitle) || (nOriginal && f.normalizedTitle === nOriginal);
      if (!titleMatches) return false;

      const yearDiff = Math.abs(f.normalizedYear - nYear);
      return yearDiff <= 1;
    });
  }

  async importFromCSV(file: File): Promise<number> {
    const text = await file.text();
    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return 0;
    
    const headers = this.parseCsvLine(lines[0]).map(h => h.toLowerCase());
    let nameIndex = headers.indexOf('name');
    let yearIndex = headers.indexOf('year');
    
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
          newFilms.push({ 
            title, 
            year,
            normalizedTitle: this.normalizeStr(title),
            normalizedYear: parseInt(year.toString().substring(0, 4), 10)
          });
        }
      }
    }

    this.watchedFilms = newFilms;
    this.saveToStorage();
    this.notifyRefresh();
    return this.getCount();
  }

  getCount(): number {
    return this.watchedFilms.length;
  }

  private parseCsvLine(line: string): string[] {
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        parts.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else current += char;
    }
    parts.push(current.trim().replace(/^"|"$/g, ''));
    return parts;
  }

  reset(): void {
    this.watchedFilms = [];
    localStorage.removeItem(this.STORAGE_KEY);
    this.notifyRefresh();
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.watchedFilms));
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // On s'assure que même les anciens imports sont normalisés au chargement
        this.watchedFilms = parsed.map((f: any) => ({
          ...f,
          normalizedTitle: f.normalizedTitle || this.normalizeStr(f.title),
          normalizedYear: f.normalizedYear || parseInt(f.year.toString().substring(0, 4), 10)
        }));
        console.log(`[WatchedService] ${this.watchedFilms.length} films vus chargés et optimisés.`);
      } catch (e) {
        console.error('Erreur lors du chargement des films vus:', e);
        this.watchedFilms = [];
      }
    }
  }
}
