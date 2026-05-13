import { Test, TestingModule } from '@nestjs/testing';
import { GetLetterboxdPicksService } from './get-letterboxd-picks.service';
import Parser from 'rss-parser';

jest.mock('rss-parser');

describe('GetLetterboxdPicksService', () => {
  let service: GetLetterboxdPicksService;
  let mockParser: any;

  beforeEach(async () => {
    mockParser = {
      parseURL: jest.fn(),
    };
    (Parser as any).mockImplementation(() => mockParser);

    const module: TestingModule = await Test.createTestingModule({
      providers: [GetLetterboxdPicksService],
    }).compile();

    service = module.get<GetLetterboxdPicksService>(GetLetterboxdPicksService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('execute', () => {
    it('devrait parser le flux RSS et retourner une liste de films simplifiée', async () => {
      // Given
      const mockRssItems = {
        items: [
          {
            title: 'Inception, ★★★★½',
            pubDate: '2024-11-10',
            link: 'https://letterboxd.com/reglegorilla/film/inception/',
          },
          {
            title: 'The Room, ½',
            pubDate: '2024-11-09',
            link: 'https://letterboxd.com/reglegorilla/film/the-room/',
          },
        ],
      };

      mockParser.parseURL = jest.fn().mockResolvedValue(mockRssItems);

      // When
      const result = await service.execute();

      // Then
      expect(mockParser.parseURL).toHaveBeenCalledWith('https://letterboxd.com/reglegorilla/rss/');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        title: 'Inception',
        letterboxdRating: 4.5,
        watchedDate: '2024-11-10',
      });
      expect(result[1]).toEqual({
        title: 'The Room',
        letterboxdRating: 0.5,
        watchedDate: '2024-11-09',
      });
    });
  });
});
