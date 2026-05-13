import { Injectable, Inject } from '@nestjs/common';
import Parser from 'rss-parser';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class GetLetterboxdPicksService {
  private parser: Parser;
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.parser = new Parser();
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  async execute(filter: string = 'all') {
    const cacheKey = `letterboxd_picks_${filter}`;
    const cached = await this.cacheManager.get<any[]>(cacheKey);
    if (cached) return cached;

    const feed = await this.parser.parseURL('https://letterboxd.com/reglegorilla/rss/');

    const allMovies = await Promise.all(
      feed.items.map(async (item) => {
        const { title, rating } = this.parseTitleAndRating(item.title || '');
        const tmdbMovie = await this.searchOnTmdb(title);

        if (!tmdbMovie) return null;

        const platform = await this.getWatchProvider(tmdbMovie.id);

        return {
          letterboxdRating: rating,
          watchedDate: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : '',
          tmdbId: tmdbMovie.id,
          title: tmdbMovie.title,
          overview: tmdbMovie.overview,
          releaseYear: tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : '',
          tmdbRating: tmdbMovie.vote_average.toFixed(1),
          poster: `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`,
          platform: platform,
        };
      })
    );

    const validMovies = allMovies.filter((m) => m !== null) as any[];
    let result = validMovies;

    if (filter === 'best') {
      result = validMovies.filter((m) => m.letterboxdRating >= 4);
    } else if (filter === 'worst') {
      result = validMovies.filter((m) => m.letterboxdRating <= 2);
    }

    await this.cacheManager.set(cacheKey, result, 3600000); // 1 hour
    return result;
  }

  private async searchOnTmdb(title: string) {
    const response = await axios.get(`${this.baseUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query: title,
        language: 'fr-FR',
      },
    });
    return response.data.results[0] || null;
  }

  private async getWatchProvider(movieId: number): Promise<string> {
    const response = await axios.get(`${this.baseUrl}/movie/${movieId}/watch/providers`, {
      params: { api_key: this.apiKey },
    });
    const fr = response.data.results?.FR;
    if (fr && fr.flatrate && fr.flatrate.length > 0) {
      return fr.flatrate[0].provider_name;
    }
    return '';
  }

  private parseTitleAndRating(fullTitle: string): { title: string; rating: number } {
    // Format attendu: "Movie Title, ★★★★½"
    const parts = fullTitle.split(', ');
    const ratingString = parts.pop() || '';
    const title = parts.join(', ');

    return {
      title,
      rating: this.convertStarsToNumber(ratingString),
    };
  }

  private convertStarsToNumber(stars: string): number {
    let rating = 0;
    for (const char of stars) {
      if (char === '★') rating += 1;
      if (char === '½') rating += 0.5;
    }
    return rating;
  }
}
