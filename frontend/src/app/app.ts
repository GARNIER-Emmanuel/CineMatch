import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './layout/navbar/navbar';
import { HeroComponent } from './features/home/hero/hero';
import { MovieRowComponent, MovieItem } from './features/home/movie-row/movie-row';
import { MovieFiltersComponent } from './features/movies/filters/movie-filters';
import { MoviesService, Movie } from './core/services/movies';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HeroComponent, MovieRowComponent, MovieFiltersComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  title = 'CineMatch';

  popularMovies: MovieItem[] = [];
  actionMovies: MovieItem[] = [];
  trendingMovies: MovieItem[] = [];
  discoveryMovies: MovieItem[] = [];

  loadingPopular = true;
  loadingAction = true;
  loadingTrending = true;
  loadingDiscovery = false;

  selectedGenre: string | null = null;
  maxDuration: number = 240;
  minRating: number = 6;

  errorMessage: string | null = null;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadAllMovies();
  }

  loadAllMovies(): void {
    this.errorMessage = null;
    this.loadingPopular = true;
    this.loadingAction = true;
    this.loadingTrending = true;

    // Récupération des films populaires
    this.moviesService.getMovies().subscribe({
      next: (movies: Movie[]) => {
        this.popularMovies = this.mapToMovieItems(movies);
        this.loadingPopular = false;
      },
      error: () => {
        this.errorMessage = "Une erreur est survenue lors de la récupération des films. Veuillez réessayer.";
        this.loadingPopular = false;
        this.loadingAction = false;
        this.loadingTrending = false;
      }
    });

    // Récupération des films d'action (28)
    this.moviesService.getMovies('28').subscribe({
      next: (movies: Movie[]) => {
        this.actionMovies = this.mapToMovieItems(movies);
        this.loadingAction = false;
      },
      error: () => {
        this.loadingAction = false;
      }
    });

    // Récupération des films d'aventure (12)
    this.moviesService.getMovies('12').subscribe({
      next: (movies: Movie[]) => {
        this.trendingMovies = this.mapToMovieItems(movies);
        this.loadingTrending = false;
      },
      error: () => {
        this.loadingTrending = false;
      }
    });
  }

  onGenreChange(genreId: string | null): void {
    this.selectedGenre = genreId;
    this.loadDiscoveryMovies();
  }

  onDurationChange(duration: number): void {
    this.maxDuration = duration;
    this.loadDiscoveryMovies();
  }

  onRatingChange(rating: number): void {
    this.minRating = rating;
    this.loadDiscoveryMovies();
  }

  loadDiscoveryMovies(): void {
    this.loadingDiscovery = true;
    this.moviesService.getMovies(this.selectedGenre, this.maxDuration, this.minRating).subscribe({
      next: (movies: Movie[]) => {
        this.discoveryMovies = this.mapToMovieItems(movies);
        this.loadingDiscovery = false;
      },
      error: () => {
        this.loadingDiscovery = false;
      }
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
