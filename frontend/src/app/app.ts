import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NavbarComponent } from './layout/navbar/navbar';
import { MovieRowComponent, MovieItem } from './features/home/movie-row/movie-row';
import { MovieFiltersComponent, Certification } from './features/movies/filters/movie-filters';
import { MoviePaginationComponent } from './features/movies/pagination/movie-pagination';
import { MovieDetailModalComponent } from './features/movies/detail-modal/movie-detail-modal';
import { DirectorsComponent } from './features/directors/directors';
import { DirectorDetailModalComponent } from './features/directors/detail-modal/director-detail-modal';
import { DirectorMoviesComponent } from './features/directors/director-movies/director-movies';
import { MoviesService, Movie } from './core/services/movies';
import { HistoryService } from './core/services/history';
import { WatchlistService } from './core/services/watchlist';
import { WatchedFilmsService } from './core/services/watched-films.service';
import { CineScrollComponent } from './features/cine-scroll/cine-scroll.component';

import { RegeFilmsComponent } from './features/regefilms/regefilms.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    MovieRowComponent, 
    MovieFiltersComponent, 
    MoviePaginationComponent,
    MovieDetailModalComponent,
    DirectorDetailModalComponent,
    DirectorMoviesComponent,
    CineScrollComponent,
    DirectorsComponent,
    RegeFilmsComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CineMatch';

  private searchSubject = new Subject<string>();
  searchResults: any[] = [];
  isSearching = false;
  searchQuery = '';
  selectedDirectorForDetails: any = null;
  selectedDirectorForMovies: { id: number, name: string } | null = null;
  popularMovies: MovieItem[] = [];
  auteurMovies: MovieItem[] = [];
  classicMovies: MovieItem[] = [];
  discoveryMovies: MovieItem[] = [];
  historyMovies: MovieItem[] = [];
  watchlistMovies: MovieItem[] = [];

  loadingPopular = true;
  loadingAuteur = true;
  loadingClassic = true;
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
  currentView: 'home' | 'watchlist' | 'cinescroll' | 'directors' | 'director-movies' | 'regefilms' = 'home';
  heroMovie: MovieItem | null = null;

  get hasActiveFilters(): boolean {
    return !!this.selectedGenre || !!this.selectedProviders || this.maxDuration < 240;
  }

  errorMessage: string | null = null;

  constructor(
    private moviesService: MoviesService,
    private historyService: HistoryService,
    private watchlistService: WatchlistService,
    private watchedService: WatchedFilmsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllMovies();
    
    this.historyService.history$.subscribe(history => {
      this.historyMovies = this.roundRatings(history);
      this.cdr.detectChanges();
    });

    this.watchlistService.watchlist$.subscribe(watchlist => {
      this.watchlistMovies = this.roundRatings(watchlist);
      this.cdr.detectChanges();
    });

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadAllMovies(): void {
    this.loadingPopular = true;
    this.loadingAuteur = true;
    this.loadingClassic = true;
    this.errorMessage = null;

    const errorHandler = (error: any) => {
      this.errorMessage = 'Une erreur est survenue lors de la récupération des films.';
      this.loadingPopular = false;
      this.loadingAuteur = false;
      this.loadingClassic = false;
      this.cdr.detectChanges();
    };

    this.moviesService.getMovies().subscribe({
      next: (movies: Movie[]) => {
        const filtered = this.filterWatched(movies);
        this.popularMovies = [...this.mapToMovieItems(filtered)];
        this.loadingPopular = false;
        if (!this.heroMovie) {
          this.heroMovie = this.popularMovies.find((m: MovieItem) => m.backdrop) || this.popularMovies[0] || null;
        }
        this.cdr.detectChanges();
      },
      error: errorHandler
    });

    this.moviesService.getMovies('18,36').subscribe({
      next: (movies: Movie[]) => {
        const filtered = this.filterWatched(movies);
        this.auteurMovies = [...this.mapToMovieItems(filtered)];
        this.loadingAuteur = false;
        this.cdr.detectChanges();
      },
      error: errorHandler
    });

    this.moviesService.getMovies(null, undefined, undefined, 1, null, null, null, undefined, 1985).subscribe({
      next: (movies: Movie[]) => {
        const filtered = this.filterWatched(movies);
        this.classicMovies = [...this.mapToMovieItems(filtered)];
        this.loadingClassic = false;
        this.cdr.detectChanges();
      },
      error: errorHandler
    });
  }

  goToHome(): void {
    console.log('Navigation vers HOME');
    this.currentView = 'home';
    this.showFilters = false;
    
    // Reset filters
    this.selectedGenre = null;
    this.selectedProviders = null;
    this.maxDuration = 240;
    this.certCountry = null;
    this.certLte = null;
    this.discoveryMovies = [];
    
    // Reset search
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearching = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  goToWatchlist(): void {
    console.log('Navigation vers WATCHLIST');
    this.currentView = 'watchlist';
    this.showFilters = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  goToCineScroll(): void {
    console.log('Navigation vers CINESCROLL');
    this.currentView = 'cinescroll';
    this.showFilters = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  goToDirectors(): void {
    console.log('Navigation vers DIRECTORS');
    this.currentView = 'directors';
    this.showFilters = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  goToRegeFilms(): void {
    console.log('Navigation vers REGEFILMS');
    this.currentView = 'regefilms';
    this.showFilters = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  onDirectorClick(director: any): void {
    this.selectedDirectorForDetails = director;
    this.cdr.detectChanges();
  }

  closeDirectorDetails(): void {
    this.selectedDirectorForDetails = null;
    this.cdr.detectChanges();
  }

  onViewDirectorMovies(directorId: number): void {
    const director = this.selectedDirectorForDetails;
    if (director) {
      this.selectedDirectorForMovies = { id: director.id, name: director.name };
      this.currentView = 'director-movies';
      this.searchQuery = '';
      this.searchResults = [];
    }
    this.closeDirectorDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  toggleFilters(): void {
    if (this.currentView !== 'home') {
      this.goToHome();
      setTimeout(() => {
        this.showFilters = true;
        this.cdr.detectChanges();
      }, 300);
    } else {
      this.showFilters = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.cdr.detectChanges();
    }
  }

  openMovieDetails(movie: MovieItem): void {
    this.selectedMovieForDetails = movie;
    this.historyService.addToHistory(movie);
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

  onSearch(query: string, immediate: boolean = false): void {
    this.searchQuery = query;
    if (!query.trim()) {
      this.isSearching = false;
      this.searchResults = [];
      this.cdr.detectChanges();
      return;
    }
    this.isSearching = true;
    if (immediate) {
      this.performSearch(query);
    } else {
      this.searchSubject.next(query);
    }
  }

  private performSearch(query: string): void {
    this.moviesService.search(query).subscribe({
      next: (results) => {
        // Filtrer les films déjà vus (on garde les personnes/réalisateurs)
        const filteredResults = results.filter(item => {
          if (item.media_type === 'person') return true;
          return !this.watchedService.isWatched(item.title, item.releaseYear);
        });

        this.searchResults = filteredResults.sort((a, b) => {
          if (a.media_type === 'person' && b.media_type !== 'person') return -1;
          if (a.media_type !== 'person' && b.media_type === 'person') return 1;
          return 0;
        });
        this.isSearching = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSearching = false;
        this.cdr.detectChanges();
      }
    });
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
    if (!append) {
      this.discoveryMovies = [];
    }
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
        const filtered = this.filterWatched(movies);
        const newItems = this.mapToMovieItems(filtered);
        if (append) this.discoveryMovies = [...this.discoveryMovies, ...newItems];
        else this.discoveryMovies = [...newItems];
        // Le bouton reste visible tant qu'on reçoit des résultats (même filtrés < 20)
        this.hasMoreResults = movies.length > 0;
        this.loadingDiscovery = false;
        this.cdr.detectChanges();

        if (append) {
          setTimeout(() => {
            document.getElementById('load-more-pagination')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }, 100);
        }
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
      rating: m.rating ? parseFloat(m.rating).toFixed(1) : '0.0',
      backdrop: m.backdrop || null,
      releaseYear: m.releaseYear
    }));
  }

  private roundRatings(movies: MovieItem[]): MovieItem[] {
    return movies.map(m => ({
      ...m,
      rating: m.rating ? parseFloat(m.rating).toFixed(1) : '0.0'
    }));
  }

  private filterWatched(movies: Movie[]): Movie[] {
    return movies.filter(m => !this.watchedService.isWatched(m.title, m.releaseYear));
  }
}
