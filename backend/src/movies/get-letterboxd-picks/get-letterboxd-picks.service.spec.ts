import { Test, TestingModule } from '@nestjs/testing';
import { GetLetterboxdPicksService } from './get-letterboxd-picks.service';
import Parser from 'rss-parser';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('rss-parser');
jest.mock('axios');

describe('GetLetterboxdPicksService', () => {
  let service: GetLetterboxdPicksService;
  let mockParser: any;
  let mockConfigService: any;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(async () => {
    mockParser = {
      parseURL: jest.fn(),
    };
    (Parser as any).mockImplementation(() => mockParser);

    mockConfigService = {
      get: jest.fn().mockReturnValue('fake_api_key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLetterboxdPicksService,
        { provide: ConfigService, useValue: mockConfigService },
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
  });
});
