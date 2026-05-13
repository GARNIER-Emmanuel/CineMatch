import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GetMovieTrailerService } from './get-movie-trailer.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GetMovieTrailerService', () => {
  let service: GetMovieTrailerService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-api-key'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMovieTrailerService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<GetMovieTrailerService>(GetMovieTrailerService);
  });

  it('should fetch youtube key for a movie', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          { key: 'dQw4w9WgXcQ', site: 'YouTube', type: 'Trailer', iso_639_1: 'fr' }
        ]
      },
    });

    const result = await service.execute(123);

    expect(result).toEqual({
      youtubeKey: 'dQw4w9WgXcQ',
      language: 'fr',
      name: undefined // On peut être plus précis si besoin
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/movie/123/videos'),
      expect.any(Object)
    );
  });

  it('should return null if no trailer found', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { results: [] },
    });

    const result = await service.execute(123);
    expect(result).toBeNull();
  });
});
