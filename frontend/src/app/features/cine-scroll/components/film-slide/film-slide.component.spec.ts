import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmSlideComponent } from './film-slide.component';
import { MoviesService } from '../../../../core/services/movies';
import { WatchlistService } from '../../../../core/services/watchlist';
import { CineScrollProfileService } from '../../../../core/services/cine-scroll-profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FilmSlideComponent', () => {
  let component: FilmSlideComponent;
  let fixture: ComponentFixture<FilmSlideComponent>;
  let mockWatchlistService: any;
  let mockProfileService: any;

  const mockMovie = {
    id: 1,
    title: 'Inception',
    overview: 'Dreams...',
    releaseYear: '2010',
    rating: '8.8',
    poster: '/p.jpg',
    backdrop: '/b.jpg',
    genreIds: [28, 12]
  };

  beforeEach(async () => {
    mockWatchlistService = {
      toggleWatchlist: vi.fn(),
      isInWatchlist: vi.fn().mockReturnValue(false)
    };
    mockProfileService = {
      like: vi.fn(),
      dislike: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [FilmSlideComponent, HttpClientTestingModule],
      providers: [
        { provide: WatchlistService, useValue: mockWatchlistService },
        { provide: CineScrollProfileService, useValue: mockProfileService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilmSlideComponent);
    component = fixture.componentInstance;
    component.movie = mockMovie;
    fixture.detectChanges();
  });

  it('doit appeler watchlistService et profileService lors d\'un Like', () => {
    // Given
    mockWatchlistService.isInWatchlist.mockReturnValue(true);

    // When
    component.onToggleWatchlist();

    // Then
    expect(mockWatchlistService.toggleWatchlist).toHaveBeenCalled();
    expect(mockProfileService.like).toHaveBeenCalledWith([28, 12]);
  });

  it('doit appeler profileService lors d\'un Dislike', () => {
    // When
    component.onNotInterested();

    // Then
    expect(mockProfileService.dislike).toHaveBeenCalledWith([28, 12]);
  });
});
