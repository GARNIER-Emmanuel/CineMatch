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
          'vote_average.gte': filters.minRating || 0,
          page: filters.page || 1,
          certification_country: filters.certificationCountry,
          'certification.lte': filters.certificationLte,
          with_watch_providers: filters.providers,
          watch_region: 'FR',
          'primary_release_date.gte': filters.releaseYearMin ? `${filters.releaseYearMin}-01-01` : undefined,
          'primary_release_date.lte': filters.releaseYearMax ? `${filters.releaseYearMax}-12-31` : undefined,
          sort_by: 'popularity.desc',
          language: 'fr-FR',
        },
      });

      return response.data.results.slice(0, 20).map((movie: any) => ({
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
      return this.handleError(error);
    }
  }

  async getWatchProviders(movieId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}/watch/providers`, {
        params: { api_key: this.apiKey },
      });

      const frResults = response.data.results?.FR;
      
      if (frResults && frResults.flatrate) {
        return frResults.flatrate.map((provider: any) => ({
          id: provider.provider_id,
          name: provider.provider_name,
          logo: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
        }));
      }

      return [];
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async getMovieImages(movieId: number): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}/images`, {
        params: { api_key: this.apiKey },
      });

      return response.data.backdrops
        .slice(0, 5)
        .map((img: any) => `https://image.tmdb.org/t/p/w1280${img.file_path}`);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async getCredits(movieId: number): Promise<{ director: string; cast: string[]; runtime: number }> {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}`, {
        params: { 
          api_key: this.apiKey, 
          language: 'fr-FR',
          append_to_response: 'credits'
        },
      });

      const director = response.data.credits.crew.find((member: any) => member.job === 'Director')?.name || 'Inconnu';
      const cast = response.data.credits.cast.slice(0, 5).map((actor: any) => actor.name);
      const runtime = response.data.runtime || 0;

      return { director, cast, runtime };
    } catch (error: any) {
      return { director: 'Inconnu', cast: [], runtime: 0 };
    }
  }

  /**
   * Type never indique que la fonction lève toujours une erreur.
   */
  private handleError(error: any): never {
    if (error.response?.status === 401) {
      throw new HttpException('Invalid TMDB API key', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
  }
}
