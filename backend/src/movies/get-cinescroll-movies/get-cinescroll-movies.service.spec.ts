import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GetCineScrollMoviesService } from './get-cinescroll-movies.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GetCineScrollMoviesService', () => {
  let service: GetCineScrollMoviesService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-api-key'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCineScrollMoviesService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<GetCineScrollMoviesService>(GetCineScrollMoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and map movies for CineScroll', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'Movie 1',
        overview: 'Overview 1',
        release_date: '2023-01-01',
        vote_average: 8.5,
        poster_path: '/poster1.jpg',
        backdrop_path: '/backdrop1.jpg',
        genre_ids: [28, 12],
      },
    ];

    mockedAxios.get.mockResolvedValue({
      data: { results: mockMovies },
    });

    const result = await service.execute({ genres: '28,12' });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 1,
      title: 'Movie 1',
      overview: 'Overview 1',
      releaseYear: '2023',
      rating: '8.5',
      poster: 'https://image.tmdb.org/t/p/w500/poster1.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/backdrop1.jpg',
      genreIds: [28, 12],
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/discover/movie'),
      expect.objectContaining({
        params: expect.objectContaining({
          with_genres: '28,12',
          api_key: 'mock-api-key',
        }),
      })
    );
  });
});
