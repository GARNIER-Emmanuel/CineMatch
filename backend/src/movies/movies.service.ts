import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DiscoverMoviesDto } from './dto/discover-movies.dto';
import { Movie } from './interfaces/movie.interface';

@Injectable()
export class MoviesService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async discover(filters: DiscoverMoviesDto): Promise<Movie[]> {
    const apiKey = this.config.get<string>('TMDB_API_KEY');
    
    const params = {
      api_key: apiKey,
      language: 'fr-FR',
      sort_by: 'vote_average.desc',
      'vote_count.gte': 200,
      with_genres: filters.genres,
      'with_runtime.lte': filters.maxDuration,
    };

    // Supprimer les clés undefined
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key],
    );

    const { data } = await firstValueFrom(
      this.httpService.get('https://api.themoviedb.org/3/discover/movie', {
        params,
      }),
    );

    return data.results.slice(0, 6).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      releaseYear: movie.release_date?.split('-')[0] || '',
      rating: movie.vote_average.toString(),
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
    }));
  }
}
