import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MoviesService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  async getMovies(genres?: string, maxDuration?: number, minRating?: number, page?: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          with_genres: genres,
          'with_runtime.lte': maxDuration,
          'vote_average.gte': minRating || 6,
          page: page || 1,
          sort_by: 'popularity.desc',
          language: 'fr-FR',
        },
      });

      return response.data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        releaseYear: movie.release_date ? movie.release_date.split('-')[0] : '',
        rating: movie.vote_average.toFixed(1),
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
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

      const providers = response.data.results?.FR?.flatrate || [];
      return providers.map((p: any) => ({
        id: p.provider_id,
        name: p.provider_name,
        logo: `https://image.tmdb.org/t/p/original${p.logo_path}`,
      }));
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async getMovieTrailer(movieId: number): Promise<{ youtubeKey: string } | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}/videos`, {
        params: { api_key: this.apiKey },
      });

      const trailer = response.data.results.find(
        (v: any) => v.site === 'YouTube' && v.type === 'Trailer'
      );

      return trailer ? { youtubeKey: trailer.key } : null;
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

  async getMovieCredits(movieId: number): Promise<{ director: string, cast: string[] }> {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}/credits`, {
        params: { api_key: this.apiKey },
      });

      const director = response.data.crew.find((member: any) => member.job === 'Director')?.name || 'Inconnu';
      const cast = response.data.cast.slice(0, 3).map((member: any) => member.name);

      return { director, cast };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.response?.status === 401) {
      throw new HttpException('Invalid TMDB API key', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
  }
}
