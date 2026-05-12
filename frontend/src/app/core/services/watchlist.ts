import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MovieItem } from '../../features/home/movie-row/movie-row';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private readonly STORAGE_KEY = 'cinematch_watchlist';
  
  private watchlistSubject = new BehaviorSubject<MovieItem[]>(this.loadFromStorage());
  watchlist$ = this.watchlistSubject.asObservable();

  /**
   * Ajoute un film à la liste
   */
  addToWatchlist(movie: MovieItem): void {
    const current = this.loadFromStorage();
    if (!current.some(m => m.id === movie.id)) {
      current.unshift(movie);
      this.saveToStorage(current);
      this.watchlistSubject.next(current);
    }
  }

  /**
   * Retire un film de la liste par son ID
   */
  removeFromWatchlist(movieId: number): void {
    let current = this.loadFromStorage();
    const index = current.findIndex(m => m.id === movieId);
    if (index > -1) {
      current.splice(index, 1);
      this.saveToStorage(current);
      this.watchlistSubject.next(current);
    }
  }

  /**
   * Ajoute ou retire un film de la liste (Legacy support)
   */
  toggleWatchlist(movie: MovieItem): void {
    if (this.isInWatchlist(movie.id)) {
      this.removeFromWatchlist(movie.id);
    } else {
      this.addToWatchlist(movie);
    }
  }

  /**
   * Vérifie si un film est dans la liste
   */
  isInWatchlist(movieId: number): boolean {
    return this.loadFromStorage().some(m => m.id === movieId);
  }

  private loadFromStorage(): MovieItem[] {
    if (typeof localStorage === 'undefined') return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(watchlist: MovieItem[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(watchlist));
  }
}
