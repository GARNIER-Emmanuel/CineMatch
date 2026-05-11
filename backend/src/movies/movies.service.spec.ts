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
  });
});
