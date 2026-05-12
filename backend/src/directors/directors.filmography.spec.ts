import { Test, TestingModule } from '@nestjs/testing';
import { DirectorsService } from './directors.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DirectorsService - Filmography', () => {
  let service: DirectorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DirectorsService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock-api-key') },
        },
      ],
    }).compile();

    service = module.get<DirectorsService>(DirectorsService);
  });

  it('devrait retourner les films d\'un réalisateur', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        crew: [
          { 
            id: 101, 
            title: 'Inception', 
            overview: '...', 
            release_date: '2010-07-16', 
            vote_average: 8.4, 
            poster_path: '/poster.jpg',
            job: 'Director'
          },
          { 
            id: 102, 
            title: 'Interstellar', 
            job: 'Producer' // Ne devrait pas être inclus si on veut que les films réalisés
          }
        ]
      }
    });

    const movies = await service.getDirectorMovies(525); // Christopher Nolan
    
    expect(movies).toBeDefined();
    expect(movies.length).toBe(1);
    expect(movies[0].title).toBe('Inception');
  });
});
