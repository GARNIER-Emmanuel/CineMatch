import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// On simule (mock) la bibliothèque axios pour ne pas faire de vrais appels internet
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MoviesService', () => {
  let service: MoviesService;

  // On crée un faux ConfigService qui renvoie une clé API bidon
  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'TMDB_API_KEY') return 'fake_api_key';
      return null;
    }),
  };

  // Avant chaque test, on prépare l'environnement NestJS
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService, // On fournit le service à tester
        { provide: ConfigService, useValue: mockConfigService }, // On utilise notre faux ConfigService
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService); // On récupère l'instance du service
  });

  // Vérifie simplement que le service a bien été initialisé
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('discover', () => {
    // SCÉNARIO : Succès avec un genre valide
    it('should return 6 movies max with required fields when a valid genre is provided (US1-S1.1)', async () => {
      // ÉTAPE 1 (Given) : On prépare les données que TMDB est censé renvoyer
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
      mockedAxios.get.mockResolvedValue(mockTmdbResponse); // On dit à notre faux axios de renvoyer ça

      // ÉTAPE 2 (When) : On appelle réellement la méthode de notre service
      const result = await service.discover({ genres: '28' });

      // ÉTAPE 3 (Then) : On vérifie que le résultat est correct
      expect(result.length).toBeLessThanOrEqual(6); // On ne veut pas plus de 6 films
      expect(result[0]).toEqual({
        id: 1,
        title: 'Test Movie',
        overview: 'Description',
        releaseYear: '2024',
        rating: '7.5',
        poster: 'https://image.tmdb.org/t/p/w500/path.jpg',
      });
      // On vérifie qu'axios a bien été appelé avec le bon genre "28"
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('discover/movie'),
        expect.objectContaining({
          params: expect.objectContaining({ with_genres: '28' }),
        }),
      );
    });

    // SCÉNARIO : Pas de genre fourni
    it('should return movies sorted by rating descending when no genre is provided (US1-S1.2)', async () => {
      const mockTmdbResponse = {
        data: {
          results: [
            { id: 1, title: 'Top Rated Movie', release_date: '2024-01-01', vote_average: 9.0, poster_path: '/top.jpg', overview: 'Best movie' },
            { id: 2, title: 'Average Movie', release_date: '2024-01-01', vote_average: 5.0, poster_path: '/avg.jpg', overview: 'Mid movie' },
          ],
        },
      };
      mockedAxios.get.mockResolvedValue(mockTmdbResponse);

      const result = await service.discover({});

      expect(result[0].rating).toBe('9'); // Le mieux noté doit être en premier
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

    // SCÉNARIO : Aucun résultat trouvé
    it('should return an empty array when TMDB returns no results for a genre (US1-S1.3)', async () => {
      mockedAxios.get.mockResolvedValue({ data: { results: [] } });

      const result = await service.discover({ genres: '99999' });

      expect(result).toEqual([]); // Doit renvoyer un tableau vide sans planter
    });

    // SCÉNARIO : Durée maximale
    it('should pass with_runtime.lte to TMDB when maxDuration is provided (US2-S2.1)', async () => {
      mockedAxios.get.mockResolvedValue({ data: { results: [] } });

      await service.discover({ maxDuration: 90 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({ 'with_runtime.lte': 90 }),
        }),
      );
    });

    // SCÉNARIO : Note minimale par défaut
    it('should pass vote_average.gte=6 to TMDB when minRating is absent (US3-S3.2)', async () => {
      mockedAxios.get.mockResolvedValue({ data: { results: [] } });

      await service.discover({});

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({ 'vote_average.gte': 6 }),
        }),
      );
    });

    // SCÉNARIO : Panne de TMDB
    it('should throw HttpException 502 when TMDB is unavailable (US5-S5.1)', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 500 } });

      await expect(service.discover({})).rejects.toThrow(
        expect.objectContaining({
          status: 502,
          message: 'TMDB API unavailable',
        }),
      );
    });

    // SCÉNARIO : Clé API invalide
    it('should throw HttpException 401 when TMDB API key is invalid (US5-S5.2)', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 401 } });

      await expect(service.discover({})).rejects.toThrow(
        expect.objectContaining({
          status: 401,
          message: 'Invalid TMDB API key',
        }),
      );
    });
  });
});
