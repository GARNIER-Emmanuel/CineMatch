import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MoviesService, Movie } from './movies';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesService]
    });
    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch movies with genres', () => {
    const mockMovies: Movie[] = [
      { id: 1, title: 'Test Movie', overview: 'Desc', releaseYear: '2024', rating: '8', poster: null }
    ];

    service.getMovies('28').subscribe(movies => {
      expect(movies.length).toBe(1);
      expect(movies).toEqual(mockMovies);
    });

    const req = httpMock.expectOne('http://localhost:3000/movies/discover?genres=28');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  });

  it('should fetch movies without genres', () => {
    const mockMovies: Movie[] = [];

    service.getMovies().subscribe(movies => {
      expect(movies.length).toBe(0);
    });

    const req = httpMock.expectOne('http://localhost:3000/movies/discover');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  });

  it('should handle API error 502', () => {
    service.getMovies().subscribe({
      next: () => { throw new Error('Should have failed with 502'); },
      error: (error) => {
        expect(error.status).toBe(502);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/movies/discover');
    req.flush('TMDB API unavailable', { status: 502, statusText: 'Bad Gateway' });
  });

  it('should fetch movies with all filters', () => {
    service.getMovies('28', 90, 7, 2).subscribe();

    const req = httpMock.expectOne(req => 
      req.url === 'http://localhost:3000/movies/discover' &&
      req.params.get('genres') === '28' &&
      req.params.get('maxDuration') === '90' &&
      req.params.get('minRating') === '7' &&
      req.params.get('page') === '2'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
