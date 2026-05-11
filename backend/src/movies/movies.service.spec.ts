import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { DiscoverMoviesDto } from './dto/discover-movies.dto';
import { Movie } from './interfaces/movie.interface';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('fake_api_key'),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('discover', () => {
    it('should return 6 movies maximum when a valid genre is provided (Scenario 1.1)', async () => {
      // Given
      const filters = { genres: '28' }; // Action
      const tmdbResponse: Partial<AxiosResponse> = {
        data: {
          results: Array(10).fill(null).map((_, i) => ({
            id: i,
            title: `Movie ${i}`,
            overview: 'Overview',
            release_date: '2024-01-01',
            vote_average: 7.5,
            poster_path: '/path.jpg',
          })),
        },
      };
      mockHttpService.get.mockReturnValue(of(tmdbResponse));

      // When
      const result = await service.discover(filters);

      // Then
      expect(result).toHaveLength(6);
      expect(result[0]).toEqual({
        id: 0,
        title: 'Movie 0',
        overview: 'Overview',
        releaseYear: '2024',
        rating: '7.5',
        poster: 'https://image.tmdb.org/t/p/w500/path.jpg',
      });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('https://api.themoviedb.org/3/discover/movie'),
        expect.objectContaining({
          params: expect.objectContaining({
            with_genres: '28',
            api_key: 'fake_api_key',
            language: 'fr-FR',
          }),
        }),
      );
    });
  });
});
