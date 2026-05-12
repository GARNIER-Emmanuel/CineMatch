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
   * Ajoute ou retire un film de la liste
   */
  toggleWatchlist(movie: MovieItem): void {
    let current = this.loadFromStorage();
    const index = current.findIndex(m => m.id === movie.id);

    if (index > -1) {
      current.splice(index, 1); // Retirer
    } else {
      current.unshift(movie); // Ajouter
    }

    this.saveToStorage(current);
    this.watchlistSubject.next(current);
  }

  /**
   * Vérifie si un film est dans la liste
   */
  isInWatchlist(movieId: number): boolean {
    return this.loadFromStorage().some(m => m.id === movieId);
  }

  private loadFromStorage(): MovieItem[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(watchlist: MovieItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(watchlist));
  }
}
