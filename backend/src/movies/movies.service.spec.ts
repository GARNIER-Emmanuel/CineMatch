import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('fake_api_key') },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('discover', () => {
    it('should return 20 movies max with required fields when a valid genre is provided', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          results: Array(10).fill({
            id: 1,
            title: 'Test Movie',
            overview: 'Test Overview',
            release_date: '2023-01-01',
            vote_average: 8.5,
            poster_path: '/path.jpg',
          }),
        },
      });

      const result = await service.discover({ genres: '28' });

      expect(result.length).toBeLessThanOrEqual(20);
      expect(result[0]).toEqual({
        id: 1,
        title: 'Test Movie',
        overview: 'Test Overview',
        releaseYear: '2023',
        rating: '8.5',
        poster: 'https://image.tmdb.org/t/p/w500/path.jpg',
      });
    });

    it('should return movies sorted by popularity descending by default', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          results: [
            { id: 1, title: 'Pop 1', vote_average: 7, release_date: '2023', poster_path: '' },
            { id: 2, title: 'Pop 2', vote_average: 9, release_date: '2023', poster_path: '' },
          ],
        },
      });

      await service.discover({});

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            sort_by: 'popularity.desc'
          }),
        }),
      );
    });

    it('should pass certification parameters if provided', async () => {
      mockedAxios.get.mockResolvedValue({ data: { results: [] } });

      await service.discover({ 
        certificationCountry: 'FR', 
        certificationLte: '12' 
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            certification_country: 'FR',
            'certification.lte': '12'
          }),
        }),
      );
    });
  });
});
