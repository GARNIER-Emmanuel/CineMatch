import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MoviesService', () => {
    let service: MoviesService;

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MoviesService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('fake_tmdb_key'),
                    },
                },
            ],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
    });

    describe('discover (Scenario 1.1)', () => {
        it('should return up to 6 movies with required fields for a valid genre', async () => {
            // Given
            const mockTmdbResults = Array(10).fill(null).map((_, i) => ({
                id: i,
                title: `Movie ${i}`,
                overview: `Overview ${i}`,
                release_date: '2024-05-11',
                vote_average: 7.8,
                poster_path: `/path${i}.jpg`,
            }));

            mockedAxios.get.mockResolvedValue({
                data: { results: mockTmdbResults },
            });

            // When
            const result = await service.discover({ genres: '28' });

            // Then
            expect(result).toBeDefined();
            expect(result.length).toBe(6); // Contrainte MVP : max 6 films
            expect(result[0]).toEqual({
                id: 0,
                title: 'Movie 0',
                overview: 'Overview 0',
                releaseYear: '2024',
                rating: '7.8',
                poster: 'https://image.tmdb.org/t/p/w500/path0.jpg',
            });

            // Vérification de l'appel à l'API TMDB
            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.stringContaining('discover/movie'),
                expect.objectContaining({
                    params: expect.objectContaining({
                        with_genres: '28',
                    }),
                }),
            );
        });
    });

    describe('discover (Scenario 1.2)', () => {
        it('should return movies sorted by rating when no genre is provided', async () => {
            // Given
            mockedAxios.get.mockResolvedValue({
                data: { results: [] },
            });

            // When
            await service.discover({});

            // Then
            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    params: expect.objectContaining({
                        sort_by: 'vote_average.desc',
                    }),
                }),
            );

            const callArgs = mockedAxios.get.mock.calls[0][1];
            expect(callArgs?.params.with_genres).toBeUndefined();
        });
    });
});
