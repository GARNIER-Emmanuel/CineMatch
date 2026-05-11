import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './layout/navbar/navbar';
import { HeroComponent } from './features/home/hero/hero';
import { MovieRowComponent, MovieItem } from './features/home/movie-row/movie-row';
import { MoviesService, Movie } from './core/services/movies';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HeroComponent, MovieRowComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  title = 'CineMatch';

  popularMovies: MovieItem[] = [];
  actionMovies: MovieItem[] = [];
  trendingMovies: MovieItem[] = [];

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    // Récupération des films populaires (sans filtre genre)
    this.moviesService.getMovies().subscribe((movies: Movie[]) => {
      this.popularMovies = this.mapToMovieItems(movies);
    });

    // Récupération des films d'action (ID genre 28 sur TMDB)
    this.moviesService.getMovies('28').subscribe((movies: Movie[]) => {
      this.actionMovies = this.mapToMovieItems(movies);
    });

    // On peut réutiliser les populaires pour les tendances ou un autre filtre
    this.moviesService.getMovies('12').subscribe((movies: Movie[]) => {
      this.trendingMovies = this.mapToMovieItems(movies);
    });
  }

  /**
   * Transforme le modèle Movie de l'API en modèle MovieItem pour le design
   */
  private mapToMovieItems(movies: Movie[]): MovieItem[] {
    return movies.map(m => ({
      id: m.id,
      title: m.title,
      poster: m.poster || 'assets/placeholder.jpg',
      rating: m.rating
    }));
  }
}
