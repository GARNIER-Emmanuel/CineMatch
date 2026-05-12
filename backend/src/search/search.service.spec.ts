import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock-api-key') },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  it('devrait retourner une liste de films lors d une recherche par titre', async () => {
    const mockMovies = {
      data: {
        results: [
          {
            id: 1,
            title: 'Inception',
            overview: 'Un film complexe',
            release_date: '2010-07-16',
            vote_average: 8.8,
            poster_path: '/inception.jpg',
            media_type: 'movie'
          }
        ]
      }
    };

    mockedAxios.get.mockResolvedValue(mockMovies);

    const results = await service.search('Inception');
    
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Inception');
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/search/multi'), expect.any(Object));
  });
});
