import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  releaseYear: string;
  rating: string;
  poster: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiUrl = 'http://localhost:3000/movies/discover';

  constructor(private http: HttpClient) {}

  /**
   * Récupère une liste de films via l'API NestJS
   * @param genres IDs des genres séparés par des virgules
   */
  getMovies(genres?: string): Observable<Movie[]> {
    const params: any = {};
    if (genres) {
      params.genres = genres;
    }
    return this.http.get<Movie[]>(this.apiUrl, { params });
  }
}
