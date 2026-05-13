import { Test, TestingModule } from '@nestjs/testing';
import { GetLetterboxdPicksService } from './get-letterboxd-picks.service';
import Parser from 'rss-parser';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

jest.mock('rss-parser');
jest.mock('axios');

describe('GetLetterboxdPicksService', () => {
  let service: GetLetterboxdPicksService;
  let mockParser: any;
  let mockConfigService: any;
  let mockCacheManager: any;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(async () => {
    mockParser = {
      parseURL: jest.fn(),
    };
    (Parser as any).mockImplementation(() => mockParser);

    mockConfigService = {
      get: jest.fn().mockReturnValue('fake_api_key'),
    };

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLetterboxdPicksService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<GetLetterboxdPicksService>(GetLetterboxdPicksService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('devrait parser le flux RSS et enrichir les films avec TMDB', async () => {
      // Given
      const mockRssItems = {
        items: [
          {
            title: 'Inception, ★★★★½',
            pubDate: '2024-11-10',
            link: 'https://letterboxd.com/reglegorilla/film/inception/',
          },
        ],
      };

      mockParser.parseURL = jest.fn().mockResolvedValue(mockRssItems);

      // Mocks TMDB
      mockedAxios.get.mockImplementation((url) => {
        if (url.includes('/search/movie')) {
          return Promise.resolve({
            data: {
              results: [
                {
                  id: 27205,
                  title: 'Inception',
                  overview: 'Un film sur les rêves',
                  release_date: '2010-07-16',
                  vote_average: 8.4,
                  poster_path: '/poster.jpg',
                },
              ],
            },
          });
        }
        if (url.includes('/watch/providers')) {
          return Promise.resolve({
            data: {
              results: {
                FR: {
                  flatrate: [{ provider_name: 'Netflix' }],
                },
              },
            },
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      // When
      const result = await service.execute();

      // Then
      expect(result[0]).toEqual({
        letterboxdRating: 4.5,
        watchedDate: '2024-11-10',
        tmdbId: 27205,
        title: 'Inception',
        overview: 'Un film sur les rêves',
        releaseYear: '2010',
        tmdbRating: '8.4',
        poster: 'https://image.tmdb.org/t/p/w500/poster.jpg',
        platform: 'Netflix',
      });
    });

    it('devrait ignorer les films non trouvés sur TMDB', async () => {
      // Given
      const mockRssItems = {
        items: [
          {
            title: 'Film Inconnu, ★★★',
            pubDate: '2024-11-10',
          },
        ],
      };

      mockParser.parseURL = jest.fn().mockResolvedValue(mockRssItems);

      mockedAxios.get.mockResolvedValue({
        data: { results: [] },
      });

      // When
      const result = await service.execute();

      // Then
      expect(result).toHaveLength(0);
    });

    it('devrait filtrer les films par note "best" (>= 4)', async () => {
      // Given
      const mockRssItems = {
        items: [
          { title: 'Super Film, ★★★★', pubDate: '2024-11-10' },
          { title: 'Bof Film, ★★', pubDate: '2024-11-09' },
        ],
      };
      mockParser.parseURL = jest.fn().mockResolvedValue(mockRssItems);
      mockedAxios.get.mockResolvedValue({
        data: { results: [{ id: 1, title: 'Film', vote_average: 8 }] },
      });

      // When
      const result = await service.execute('best');

      // Then
      expect(result).toHaveLength(1);
      expect(result[0].letterboxdRating).toBeGreaterThanOrEqual(4);
    });

    it('devrait filtrer les films par note "worst" (<= 2)', async () => {
      // Given
      const mockRssItems = {
        items: [
          { title: 'Super Film, ★★★★', pubDate: '2024-11-10' },
          { title: 'Nul Film, ★', pubDate: '2024-11-09' },
        ],
      };
      mockParser.parseURL = jest.fn().mockResolvedValue(mockRssItems);
      mockedAxios.get.mockResolvedValue({
        data: { results: [{ id: 1, title: 'Film', vote_average: 8 }] },
      });

      // When
      const result = await service.execute('worst');

      // Then
      expect(result).toHaveLength(1);
      expect(result[0].letterboxdRating).toBeLessThanOrEqual(2);
    });

    it('devrait retourner les données du cache si présentes', async () => {
      // Given
      const cachedData = [{ title: 'Cached Movie' }];
      mockCacheManager.get.mockResolvedValue(cachedData);

      // When
      const result = await service.execute();

      // Then
      expect(result).toEqual(cachedData);
      expect(mockParser.parseURL).not.toHaveBeenCalled();
      expect(mockCacheManager.get).toHaveBeenCalledWith('letterboxd_picks_all');
    });

    it('devrait mettre en cache les données après récupération', async () => {
      // Given
      mockCacheManager.get.mockResolvedValue(null);
      mockParser.parseURL.mockResolvedValue({ items: [] });

      // When
      await service.execute('best');

      // Then
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'letterboxd_picks_best',
        expect.any(Array),
        3600000 // 1 hour in ms
      );
    });
  });
});
