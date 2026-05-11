import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface Movie {
    id: number;
    title: string;
    overview: string;
    releaseYear: string;
    rating: string;
    poster: string | null;
}

interface TmdbMovie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    poster_path: string | null;
}

@Injectable()
export class MoviesService {
    private readonly apiKey: string;
    private readonly baseUrl = 'https://api.themoviedb.org/3';

    constructor(private config: ConfigService) {
        this.apiKey = this.config.get<string>('TMDB_API_KEY');
    }

    async discover(filters: { genres?: string }): Promise<Movie[]> {
        const response = await axios.get<{ results: TmdbMovie[] }>(
            `${this.baseUrl}/discover/movie`,
            {
                params: {
                    api_key: this.apiKey,
                    with_genres: filters.genres,
                    language: 'fr-FR',
                    sort_by: 'vote_average.desc',
                },
            },
        );

        // On ne garde que les 6 premiers résultats comme demandé dans le MVP
        return response.data.results.slice(0, 6).map((m) => ({
            id: m.id,
            title: m.title,
            overview: m.overview,
            releaseYear: m.release_date ? m.release_date.split('-')[0] : '',
            rating: m.vote_average.toString(),
            poster: m.poster_path
                ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                : null,
        }));
    }
}
