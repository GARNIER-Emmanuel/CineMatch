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
   */
  getMovies(genres?: string | null, maxDuration?: number, minRating?: number, page?: number): Observable<Movie[]> {
    const params: any = {};
    if (genres) params.genres = genres;
    if (maxDuration) params.maxDuration = maxDuration;
    if (minRating) params.minRating = minRating;
    if (page) params.page = page;
    
    return this.http.get<Movie[]>(this.apiUrl, { params });
  }
}
