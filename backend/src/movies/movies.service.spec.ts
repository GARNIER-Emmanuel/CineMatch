import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MoviesService', () => {
  let service: MoviesService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'TMDB_API_KEY') return 'fake_api_key';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('discover', () => {
    it('should return 6 movies max with required fields when a valid genre is provided (US1-S1.1)', async () => {
      // Given
      const mockTmdbResponse = {
        data: {
          results: Array(10).fill({
            id: 1,
            title: 'Test Movie',
            overview: 'Description',
            release_date: '2024-01-01',
            vote_average: 7.5,
            poster_path: '/path.jpg',
          }),
        },
      };
      mockedAxios.get.mockResolvedValue(mockTmdbResponse);

      // When
      const result = await service.discover({ genres: '28' });

      // Then
      expect(result.length).toBeLessThanOrEqual(6);
      expect(result[0]).toEqual({
        id: 1,
        title: 'Test Movie',
        overview: 'Description',
        releaseYear: '2024',
        rating: '7.5',
        poster: 'https://image.tmdb.org/t/p/w500/path.jpg',
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('discover/movie'),
        expect.objectContaining({
          params: expect.objectContaining({ with_genres: '28' }),
        }),
      );
    });

    it('should return movies sorted by rating descending when no genre is provided (US1-S1.2)', async () => {
      // Given
      const mockTmdbResponse = {
        data: {
          results: [
            { id: 1, title: 'Top Rated Movie', release_date: '2024-01-01', vote_average: 9.0, poster_path: '/top.jpg', overview: 'Best movie' },
            { id: 2, title: 'Average Movie', release_date: '2024-01-01', vote_average: 5.0, poster_path: '/avg.jpg', overview: 'Mid movie' },
          ],
        },
      };
      mockedAxios.get.mockResolvedValue(mockTmdbResponse);

      // When
      const result = await service.discover({});

      // Then
      expect(result[0].rating).toBe('9');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({ 
            sort_by: 'vote_average.desc',
            with_genres: undefined 
          }),
        }),
      );
    });

    it('should return an empty array when TMDB returns no results for a genre (US1-S1.3)', async () => {
      // Given
      const mockTmdbResponse = {
        data: {
          results: [],
        },
      };
      mockedAxios.get.mockResolvedValue(mockTmdbResponse);

      // When
      const result = await service.discover({ genres: '99999' });

      // Then
      expect(result).toEqual([]);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({ with_genres: '99999' }),
        }),
      );
    });

    it('should pass with_runtime.lte to TMDB when maxDuration is provided (US2-S2.1)', async () => {
      // Given
      const mockTmdbResponse = { data: { results: [] } };
      mockedAxios.get.mockResolvedValue(mockTmdbResponse);

      // When
      await service.discover({ maxDuration: 90 });

      // Then
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({ 'with_runtime.lte': 90 }),
        }),
      );
    });

    it('should not pass with_runtime.lte to TMDB when maxDuration is absent (US2-S2.2)', async () => {
      // Given
      const mockTmdbResponse = { data: { results: [] } };
      mockedAxios.get.mockResolvedValue(mockTmdbResponse);

      // When
      await service.discover({});

      // Then
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({ 'with_runtime.lte': undefined }),
        }),
      );
    });

    it('should pass vote_average.gte to TMDB when minRating is provided (US3-S3.1)', async () => {
      // Given
      const mockTmdbResponse = { data: { results: [] } };
      mockedAxios.get.mockResolvedValue(mockTmdbResponse);

      // When
      await service.discover({ minRating: 7 });

      // Then
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({ 'vote_average.gte': 7 }),
        }),
      );
    });

    it('should pass vote_average.gte=6 to TMDB when minRating is absent (US3-S3.2)', async () => {
      // Given
      const mockTmdbResponse = { data: { results: [] } };
      mockedAxios.get.mockResolvedValue(mockTmdbResponse);

      // When
      await service.discover({});

      // Then
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({ 'vote_average.gte': 6 }),
        }),
      );
    });
  });
});
