import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../../core/services/movies';
import { MovieCardRegeComponent } from './components/movie-card-rege/movie-card-rege';
import { WatchedFilmsService } from '../../core/services/watched-films.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cm-regefilms',
  standalone: true,
  imports: [CommonModule, MovieCardRegeComponent],
  templateUrl: './regefilms.component.html',
  styleUrl: './regefilms.component.css'
})
export class RegeFilmsComponent implements OnInit, OnDestroy {
  @Output() movieClick = new EventEmitter<any>();
  
  bestPicks: any[] = [];
  worstPicks: any[] = [];
  isLoading = true;
  private refreshSub?: Subscription;
  
  @ViewChild('bestRow') bestRow!: ElementRef;
  @ViewChild('worstRow') worstRow!: ElementRef;

  canScrollBestLeft = false;
  canScrollBestRight = true;
  canScrollWorstLeft = false;
  canScrollWorstRight = true;

  constructor(
    private moviesService: MoviesService,
    private watchedService: WatchedFilmsService,
    private cdr: ChangeDetectorRef
  ) {}

  scroll(direction: 'left' | 'right', type: 'best' | 'worst') {
    const el = type === 'best' ? this.bestRow.nativeElement : this.worstRow.nativeElement;
    const scrollAmount = direction === 'left' ? -600 : 600;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  onScroll(type: 'best' | 'worst'): void {
    const el = type === 'best' ? this.bestRow.nativeElement : this.worstRow.nativeElement;
    if (type === 'best') {
      this.canScrollBestLeft = el.scrollLeft > 0;
      this.canScrollBestRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 10;
    } else {
      this.canScrollWorstLeft = el.scrollLeft > 0;
      this.canScrollWorstRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 10;
    }
  }

  ngOnInit(): void {
    this.loadPicks();

    this.refreshSub = this.watchedService.refresh$.subscribe(() => {
      console.log('[RegeFilms] Rafraîchissement des sélections demandé...');
      this.loadPicks();
    });
    
    // Sécurité ultime : On arrête le loader après 5s quoi qu'il arrive
    setTimeout(() => {
      if (this.isLoading) {
        console.warn('[RegeFilms] Le chargement a dépassé 5s, forçage de l\'affichage.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 5000);
  }

  loadPicks(): void {
    console.log('[RegeFilms] Chargement des films...');
    this.isLoading = true;
    this.moviesService.getLetterboxdPicks('all').subscribe({
      next: (picks) => {
        console.log('[RegeFilms] Données reçues:', picks?.length || 0, 'films');
        try {
          if (Array.isArray(picks)) {
            // Filtrer les films déjà vus
            const filteredPicks = picks.filter(p => !this.watchedService.isWatched(p.title, p.releaseYear));
            
            this.bestPicks = filteredPicks.filter(p => Number(p.letterboxdRating) >= 4);
            this.worstPicks = filteredPicks.filter(p => Number(p.letterboxdRating) <= 2);
            console.log('[RegeFilms] Filtrage terminé:', this.bestPicks.length, 'coups de coeur,', this.worstPicks.length, 'à éviter');
          } else {
            console.error('[RegeFilms] Les données reçues ne sont pas un tableau:', picks);
          }
        } catch (err) {
          console.error('[RegeFilms] Erreur lors du traitement des films:', err);
        } finally {
          this.isLoading = false;
          this.cdr.detectChanges(); // Forcer la mise à jour de la vue
        }
      },
      error: (err) => {
        console.error('[RegeFilms] Erreur lors de la récupération des films:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onMovieClick(movie: any): void {
    // Adapter le format pour la modale globale si nécessaire
    this.movieClick.emit({
      id: movie.tmdbId,
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster,
      rating: movie.tmdbRating,
      releaseYear: movie.releaseYear
    });
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }
}
