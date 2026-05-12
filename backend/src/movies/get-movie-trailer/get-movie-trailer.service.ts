import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface MovieTrailer {
  youtubeKey: string;
  language: string;
  name: string;
}

@Injectable()
export class GetMovieTrailerService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  async execute(movieId: number): Promise<MovieTrailer | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/movie/${movieId}/videos`, {
        params: {
          api_key: this.apiKey,
          append_to_response: 'videos'
        },
      });

      const videos = response.data.results;
      
      // On cherche un trailer YouTube, priorité à la langue française
      const trailer = 
        videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.iso_639_1 === 'fr') ||
        videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');

      if (!trailer) return null;

      return {
        youtubeKey: trailer.key,
        language: trailer.iso_639_1,
        name: trailer.name
      };
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
    }
  }
}
