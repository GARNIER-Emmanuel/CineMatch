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

      const validMovies = response.data.results.filter(
        (movie: any) => movie.poster_path !== null && movie.vote_average > 0
      );

      return validMovies.slice(0, 20).map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        overview: movie.overview,
        releaseYear: movie.release_date ? movie.release_date.split('-')[0] : '',
        rating: movie.vote_average.toFixed(1),
        poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
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

  async getPopularDirectors(page: number = 1): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/person/popular`, {
        params: { api_key: this.apiKey, language: 'fr-FR', page },
      });

      return response.data.results
        .filter((person: any) => person.known_for_department === 'Directing')
        .map((dir: any) => ({
          id: dir.id,
          name: dir.name,
          profilePath: dir.profile_path ? `https://image.tmdb.org/t/p/w500${dir.profile_path}` : null,
          popularMovies: dir.known_for.map((m: any) => m.title || m.name),
        }));
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async getDirectorDetails(id: number): Promise<any> {
    try {
      const [personRes, creditsRes] = await Promise.all([
        axios.get(`${this.baseUrl}/person/${id}`, {
          params: { api_key: this.apiKey, language: 'fr-FR' },
        }),
        axios.get(`${this.baseUrl}/person/${id}/combined_credits`, {
          params: { api_key: this.apiKey, language: 'fr-FR' },
        }),
      ]);

      const person = personRes.data;
      const credits = creditsRes.data.crew.filter((m: any) => m.job === 'Director');

      // Calculate stats
      const genreCounts: Record<number, number> = {};
      let totalRating = 0;
      let ratedMoviesCount = 0;

      credits.forEach((movie: any) => {
        if (movie.genre_ids) {
          movie.genre_ids.forEach((gid: number) => {
            genreCounts[gid] = (genreCounts[gid] || 0) + 1;
          });
        }
        if (movie.vote_average > 0) {
          totalRating += movie.vote_average;
          ratedMoviesCount++;
        }
      });

      // Simple genre map for MVP (could be fetched from API)
      const genreMap: Record<number, string> = {
        28: 'Action', 12: 'Aventure', 16: 'Animation', 35: 'Comédie', 80: 'Crime',
        99: 'Documentaire', 18: 'Drame', 10751: 'Famille', 14: 'Fantastique',
        36: 'Histoire', 27: 'Horreur', 10402: 'Musique', 9648: 'Mystère',
        10749: 'Romance', 878: 'Science-Fiction', 10770: 'Téléfilm',
        53: 'Thriller', 10752: 'Guerre', 37: 'Western'
      };

      const mainGenres = Object.entries(genreCounts)
        .map(([id, count]) => ({ name: genreMap[Number(id)] || 'Autre', count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        id: person.id,
        name: person.name,
        biography: person.biography,
        profilePath: person.profile_path ? `https://image.tmdb.org/t/p/original${person.profile_path}` : null,
        birthday: person.birthday,
        placeOfBirth: person.place_of_birth,
        knownFor: credits
          .sort((a: any, b: any) => b.popularity - a.popularity)
          .slice(0, 15)
          .map((m: any) => ({
            id: m.id,
            title: m.title || m.name,
            poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            releaseYear: (m.release_date || m.first_air_date || '').split('-')[0],
            rating: m.vote_average.toFixed(1),
          })),
        stats: {
          mainGenres,
          totalMovies: credits.length,
          averageRating: ratedMoviesCount > 0 ? (totalRating / ratedMoviesCount).toFixed(1) : '0',
        }
      };
    } catch (error: any) {
      return this.handleError(error);
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
