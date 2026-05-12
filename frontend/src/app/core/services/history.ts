import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MovieItem } from '../../features/home/movie-row/movie-row';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly STORAGE_KEY = 'cinematch_history';
  private readonly MAX_HISTORY = 10;
  
  private historySubject = new BehaviorSubject<MovieItem[]>(this.loadFromStorage());
  history$ = this.historySubject.asObservable();

  /**
   * Ajoute un film au début de l'historique (sans doublon)
   */
  addToHistory(movie: MovieItem): void {
    let current = this.loadFromStorage();
    
    // Supprimer si déjà présent
    current = current.filter(m => m.id !== movie.id);
    
    // Ajouter au début
    current.unshift(movie);
    
    // Limiter la taille
    if (current.length > this.MAX_HISTORY) {
      current = current.slice(0, this.MAX_HISTORY);
    }

    this.saveToStorage(current);
    this.historySubject.next(current);
  }

  /**
   * Récupère l'historique actuel
   */
  getHistory(): MovieItem[] {
    return this.historySubject.value;
  }

  private loadFromStorage(): MovieItem[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(history: MovieItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.historySubject.next([]);
  }
}
