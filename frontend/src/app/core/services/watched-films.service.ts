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
    return false; // RED: Toujours false pour l'instant
  }

  // Méthode temporaire pour le test RED
  private addFilmManually(title: string, year: string) {
    this.watchedFilms.push({ title, year });
  }
}
