import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Movie } from './interfaces/movie.interface';
import { DiscoverMoviesDto } from './dto/discover-movies.dto';

@Injectable()
export class MoviesService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY');
  }

  async discover(filters: DiscoverMoviesDto): Promise<Movie[]> {
    const response = await axios.get(`${this.baseUrl}/discover/movie`, {
      params: {
        api_key: this.apiKey,
        with_genres: filters.genres,
        'with_runtime.lte': filters.maxDuration,
        'vote_average.gte': filters.minRating || 6,
        page: filters.page || 1,
        sort_by: 'vote_average.desc',
        language: 'fr-FR',
      },
    });

    const movies = response.data.results.slice(0, 6).map((movie: any) => ({
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
  }
}
