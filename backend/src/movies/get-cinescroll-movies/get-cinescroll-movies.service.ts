import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GetCineScrollMoviesDto } from './get-cinescroll-movies.dto';

export interface CineScrollMovie {
  id: number;
  title: string;
  overview: string;
  releaseYear: string;
  rating: string;
  poster: string | null;
  backdrop: string | null;
  genreIds: number[];
}

@Injectable()
export class GetCineScrollMoviesService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  async execute(dto: GetCineScrollMoviesDto): Promise<CineScrollMovie[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          with_genres: dto.genres,
          without_genres: dto.excludeGenres,
          page: dto.page || 1,
          sort_by: 'popularity.desc',
          language: 'fr-FR',
          'vote_count.gte': 100, // Pour éviter les films obscurs dans CineScroll
        },
      });

      return response.data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseYear: movie.release_date ? movie.release_date.split('-')[0] : '',
        rating: movie.vote_average.toFixed(1),
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        backdrop: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
          : null,
        genreIds: movie.genre_ids,
      }));
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new HttpException('Invalid TMDB API key', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
    }
  }
}
