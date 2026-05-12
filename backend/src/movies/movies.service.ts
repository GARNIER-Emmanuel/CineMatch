import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Movie } from './interfaces/movie.interface';
import { DiscoverMoviesDto } from './dto/discover-movies.dto';

@Injectable()
export class MoviesService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  async discover(filters: DiscoverMoviesDto): Promise<Movie[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          with_genres: filters.genres,
          'with_runtime.lte': filters.maxDuration,
          'vote_average.gte': filters.minRating || 0, // Ajusté à 0 car le front envoie 0 maintenant
          page: filters.page || 1,
          certification_country: filters.certificationCountry,
          'certification.lte': filters.certificationLte,
          sort_by: 'popularity.desc',
          language: 'fr-FR',
        },
      });

      const movies = response.data.results.slice(0, 20).map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseYear: movie.release_date ? movie.release_date.split('-')[0] : '',
        rating: movie.vote_average.toString(),
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      }));

      return movies;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new HttpException('Invalid TMDB API key', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
    }
  }
}
