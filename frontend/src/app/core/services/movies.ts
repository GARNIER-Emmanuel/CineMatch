import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  releaseYear: string;
  rating: string;
  poster: string | null;
  backdrop: string | null;
  genreIds?: number[];
}

export interface WatchProvider {
  id: number;
  name: string;
  logo: string;
}

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private apiUrl = 'http://localhost:3000/movies';

  constructor(private http: HttpClient) {}

  getMovies(
    genres?: string | null, 
    maxDuration?: number, 
    minRating?: number, 
    page?: number,
    certCountry?: string | null,
    certLte?: string | null,
    providers?: string | null
  ): Observable<Movie[]> {
    let params = new HttpParams();
    
    if (genres) params = params.set('genres', genres);
    if (maxDuration) params = params.set('maxDuration', maxDuration.toString());
    if (minRating !== undefined) params = params.set('minRating', minRating.toString());
    if (page) params = params.set('page', page.toString());
    if (certCountry) params = params.set('certificationCountry', certCountry);
    if (certLte) params = params.set('certificationLte', certLte);
    if (providers) params = params.set('providers', providers);

    return this.http.get<Movie[]>(`${this.apiUrl}/discover`, { params });
  }

  /**
   * Récupère les films pour le mode CineScroll
   */
  getCineScrollMovies(genres?: string, excludeGenres?: string, page?: number): Observable<Movie[]> {
    let params = new HttpParams();
    if (genres) params = params.set('genres', genres);
    if (excludeGenres) params = params.set('excludeGenres', excludeGenres);
    if (page) params = params.set('page', page.toString());

    return this.http.get<Movie[]>(`${this.apiUrl}/cinescroll`, { params });
  }

  /**
   * Récupère la clé YouTube d'un trailer de film
   */
  getMovieTrailer(movieId: number): Observable<{ youtubeKey: string } | null> {
    return this.http.get<{ youtubeKey: string } | null>(`${this.apiUrl}/${movieId}/trailer`);
  }

  /**
   * Récupère les plateformes de streaming d'un film spécifique
   */
  getMovieProviders(movieId: number): Observable<WatchProvider[]> {
    return this.http.get<WatchProvider[]>(`${this.apiUrl}/${movieId}/providers`);
  }

  getMovieImages(movieId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${movieId}/images`);
  }
}
