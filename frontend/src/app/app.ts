import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './layout/navbar/navbar';
import { MovieRowComponent, MovieItem } from './features/home/movie-row/movie-row';
import { MovieFiltersComponent, Certification } from './features/movies/filters/movie-filters';
import { MoviePaginationComponent } from './features/movies/pagination/movie-pagination';
import { MovieDetailModalComponent } from './features/movies/detail-modal/movie-detail-modal';
import { MoviesService, Movie } from './core/services/movies';
import { HistoryService } from './core/services/history'; // Nouveau

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    MovieRowComponent, 
    MovieFiltersComponent, 
    MoviePaginationComponent,
    MovieDetailModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  title = 'CineMatch';

  popularMovies: MovieItem[] = [];
  actionMovies: MovieItem[] = [];
  trendingMovies: MovieItem[] = [];
  discoveryMovies: MovieItem[] = [];
  historyMovies: MovieItem[] = []; // Nouveau

  loadingPopular = true;
  loadingAction = true;
  loadingTrending = true;
  loadingDiscovery = false;

  selectedGenre: string | null = null;
  selectedProviders: string | null = null;
  maxDuration: number = 240;
  currentPage: number = 1;
  hasMoreResults: boolean = true;
  
  certCountry: string | null = null;
  certLte: string | null = null;

  showFilters: boolean = false;
  selectedMovieForDetails: MovieItem | null = null;

  get hasActiveFilters(): boolean {
    return !!this.selectedGenre || !!this.selectedProviders || this.maxDuration < 240;
  }

  errorMessage: string | null = null;

  constructor(
    private moviesService: MoviesService,
    private historyService: HistoryService, // Injection
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllMovies();
    
    // Suivre l'évolution de l'historique
    this.historyService.history$.subscribe(history => {
      this.historyMovies = history;
      this.cdr.detectChanges();
    });
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

    this.moviesService.getMovies(null, 120, 0).subscribe({
      next: (movies: Movie[]) => {
        this.trendingMovies = [...this.mapToMovieItems(movies)];
        this.loadingTrending = false;
        this.cdr.detectChanges();
      },
      error: errorHandler
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.cdr.detectChanges();
  }

  openMovieDetails(movie: MovieItem): void {
    this.selectedMovieForDetails = movie;
    this.historyService.addToHistory(movie); // Ajout à l'historique
    this.cdr.detectChanges();
  }

  closeMovieDetails(): void {
    this.selectedMovieForDetails = null;
    this.cdr.detectChanges();
  }

  onGenreChange(genreId: string | null): void {
    this.selectedGenre = genreId;
    this.currentPage = 1;
    this.loadDiscoveryMovies(false);
  }

  onProviderChange(providers: string | null): void {
    this.selectedProviders = providers;
    this.currentPage = 1;
    this.loadDiscoveryMovies(false);
  }

  onDurationChange(duration: number): void {
    this.maxDuration = duration;
    this.currentPage = 1;
    this.loadDiscoveryMovies(false);
  }

  onCertificationChange(cert: Certification | null): void {
    this.certCountry = cert?.country || null;
    this.certLte = cert?.lte || null;
    this.currentPage = 1;
    this.loadDiscoveryMovies(false);
  }

  onLoadMore(): void {
    this.currentPage++;
    this.loadDiscoveryMovies(true);
  }

  loadDiscoveryMovies(append: boolean = false): void {
    this.loadingDiscovery = true;
    this.moviesService.getMovies(
      this.selectedGenre, 
      this.maxDuration, 
      0, 
      this.currentPage,
      this.certCountry || undefined,
      this.certLte || undefined,
      this.selectedProviders || undefined
    ).subscribe({
      next: (movies: Movie[]) => {
        const newItems = this.mapToMovieItems(movies);
        
        if (append) {
          this.discoveryMovies = [...this.discoveryMovies, ...newItems];
        } else {
          this.discoveryMovies = [...newItems];
        }

        this.hasMoreResults = movies.length >= 20;
        
        this.loadingDiscovery = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingDiscovery = false;
        this.cdr.detectChanges();
      }
    });
  }

  private mapToMovieItems(movies: Movie[]): MovieItem[] {
    return movies.map(m => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      poster: m.poster || 'assets/placeholder.jpg',
      rating: m.rating
    }));
  }
}
