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
    const { data } = await firstValueFrom(
      this.httpService.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: apiKey,
          with_genres: filters.genres,
          language: 'fr-FR',
        },
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
