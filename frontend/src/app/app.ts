import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './layout/navbar/navbar';
import { MovieRowComponent, MovieItem } from './features/home/movie-row/movie-row';
import { MovieFiltersComponent } from './features/movies/filters/movie-filters';
import { MoviePaginationComponent } from './features/movies/pagination/movie-pagination';
import { MoviesService, Movie } from './core/services/movies';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MovieRowComponent, MovieFiltersComponent, MoviePaginationComponent],
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
  currentPage: number = 1;

  get hasActiveFilters(): boolean {
    return !!this.selectedGenre || this.maxDuration < 240 || this.minRating > 6;
  }

  errorMessage: string | null = null;

  constructor(
    private moviesService: MoviesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllMovies();
  }

  loadAllMovies(): void {
    this.loadingPopular = true;
    this.loadingAction = true;
    this.loadingTrending = true;
    this.errorMessage = null;

    const errorHandler = (error: any) => {
      if (error.status === 502) {
        this.errorMessage = 'Le service TMDB est temporairement indisponible.';
      } else if (error.status === 401) {
        this.errorMessage = 'Erreur de configuration serveur (Clé API).';
      } else {
        this.errorMessage = 'Une erreur est survenue lors de la récupération des films. Veuillez réessayer.';
      }
      this.loadingPopular = false;
      this.loadingAction = false;
      this.loadingTrending = false;
      this.cdr.detectChanges();
    };

    this.moviesService.getMovies().subscribe({
      next: (movies: Movie[]) => {
        this.popularMovies = [...this.mapToMovieItems(movies)];
        this.loadingPopular = false;
        this.cdr.detectChanges();
      },
      error: errorHandler
    });

    this.moviesService.getMovies('28').subscribe({
      next: (movies: Movie[]) => {
        this.actionMovies = [...this.mapToMovieItems(movies)];
        this.loadingAction = false;
        this.cdr.detectChanges();
      },
      error: errorHandler
    });

    this.moviesService.getMovies(null, 120, 7).subscribe({
      next: (movies: Movie[]) => {
        this.trendingMovies = [...this.mapToMovieItems(movies)];
        this.loadingTrending = false;
        this.cdr.detectChanges();
      },
      error: errorHandler
    });
  }

  onGenreChange(genreId: string | null): void {
    this.selectedGenre = genreId;
    this.currentPage = 1;
    this.loadDiscoveryMovies();
  }

  onDurationChange(duration: number): void {
    this.maxDuration = duration;
    this.currentPage = 1;
    this.loadDiscoveryMovies();
  }

  onRatingChange(rating: number): void {
    this.minRating = rating;
    this.currentPage = 1;
    this.loadDiscoveryMovies();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDiscoveryMovies();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  loadDiscoveryMovies(): void {
    this.loadingDiscovery = true;
    this.moviesService.getMovies(this.selectedGenre, this.maxDuration, this.minRating, this.currentPage).subscribe({
      next: (movies: Movie[]) => {
        this.discoveryMovies = [...this.mapToMovieItems(movies)];
        this.loadingDiscovery = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingDiscovery = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Transforme le modèle Movie de l'API en modèle MovieItem pour le design
   * Inclut le tri par note décroissante (Tâche 1)
   */
  private mapToMovieItems(movies: Movie[]): MovieItem[] {
    return movies
      .map(m => ({
        id: m.id,
        title: m.title,
        poster: m.poster || 'assets/placeholder.jpg',
        rating: m.rating
      }))
      .sort((a, b) => Number(b.rating) - Number(a.rating));
  }
}
