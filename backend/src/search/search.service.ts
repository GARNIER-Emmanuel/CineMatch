import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Movie } from '../movies/interfaces/movie.interface';

@Injectable()
export class SearchService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  async search(query: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/search/multi`, {
        params: {
          api_key: this.apiKey,
          query: query,
          language: 'fr-FR',
          include_adult: false,
        },
      });

      return response.data.results.map((item: any) => {
        if (item.media_type === 'movie') {
          return {
            id: item.id,
            title: item.title,
            overview: item.overview,
            releaseYear: item.release_date ? item.release_date.split('-')[0] : '',
            rating: item.vote_average?.toFixed(1) || '0.0',
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
            backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
            media_type: 'movie'
          };
        } else if (item.media_type === 'person') {
          return {
            id: item.id,
            name: item.name,
            profilePath: item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : null,
            knownFor: item.known_for_department,
            media_type: 'person'
          };
        }
        return item;
      });
    } catch (error: any) {
      throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
    }
  }
}
