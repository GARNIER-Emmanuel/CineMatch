import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import Parser from 'rss-parser';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class GetLetterboxdPicksService implements OnModuleInit {
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

  /**
   * Pré-charge les données au démarrage du serveur
   * pour que la première requête utilisateur soit instantanée.
   */
  async onModuleInit() {
    console.log('[RegePicks] Pré-chargement des données au démarrage...');
    this.execute('all').then((result) => {
      console.log(`[RegePicks] Pré-chargement terminé: ${result.length} films en cache`);
    }).catch((err) => {
      console.error(`[RegePicks] Erreur pré-chargement: ${err.message}`);
    });
  }

  async execute(filter: string = 'all') {
    const cacheKey = `letterboxd_picks_${filter}`;
    const cached = await this.cacheManager.get<any[]>(cacheKey);
    if (cached) {
      console.log(`[RegePicks] Cache hit pour ${filter}: ${cached.length} films`);
      return cached;
    }

    console.log(`[RegePicks] Cache miss — récupération du flux RSS...`);
    const feedUrl = 'https://letterboxd.com/regelegorila/rss/';
    
    let feed;
    try {
      feed = await this.parser.parseURL(feedUrl);
      console.log(`[RegePicks] Flux RSS récupéré: ${feed.items.length} items`);
    } catch (e) {
      console.error(`[RegePicks] Erreur flux RSS: ${e.message}`);
      return [];
    }

    const items = feed.items.slice(0, 40);

    const allMovies = await Promise.all(
      items.map(async (item) => {
        try {
          const { title, rating } = this.parseTitleAndRating(item.title || '');
          if (!title) return null;

          const movieCacheKey = `movie_data_${title}`;
          let movieData = await this.cacheManager.get<any>(movieCacheKey);

          if (!movieData) {
            const tmdbMovie = await this.searchOnTmdb(title);
            if (!tmdbMovie || tmdbMovie.vote_average === 0) return null;

            movieData = {
              tmdbId: tmdbMovie.id,
              title: tmdbMovie.title,
              originalTitle: tmdbMovie.original_title,
              overview: tmdbMovie.overview,
              releaseYear: tmdbMovie.release_date ? tmdbMovie.release_date.split('-')[0] : '',
              tmdbRating: tmdbMovie.vote_average.toFixed(1),
              poster: tmdbMovie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` 
                : null,
              platform: '',
            };

            await this.cacheManager.set(movieCacheKey, movieData, 86400000);
          }

          return {
            ...movieData,
            letterboxdRating: rating,
            watchedDate: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : '',
          };
        } catch (err) {
          console.error(`[RegePicks] Erreur item "${item.title}": ${err.message}`);
          return null;
        }
      })
    );

    const validMovies = allMovies.filter((m) => m !== null) as any[];
    
    // Déduplication par tmdbId
    const uniqueMoviesMap = new Map<number, any>();
    for (const movie of validMovies) {
      if (!uniqueMoviesMap.has(movie.tmdbId)) {
        uniqueMoviesMap.set(movie.tmdbId, movie);
      }
    }
    const uniqueMovies = Array.from(uniqueMoviesMap.values());

    let result = uniqueMovies;

    if (filter === 'best') {
      result = uniqueMovies.filter((m) => m.letterboxdRating >= 4);
    } else if (filter === 'worst') {
      result = uniqueMovies.filter((m) => m.letterboxdRating <= 2);
    }

    console.log(`[RegePicks] Résultat final: ${result.length} films uniques (filtre: ${filter})`);
    await this.cacheManager.set(cacheKey, result, 86400000);
    return result;
  }

  private async searchOnTmdb(title: string) {
    const response = await axios.get(`${this.baseUrl}/search/movie`, {
      params: {
        api_key: this.apiKey,
        query: title,
        language: 'fr-FR',
      },
      timeout: 5000,
    });
    return response.data.results[0] || null;
  }

  private parseTitleAndRating(fullTitle: string): { title: string; rating: number } {
    // Format Letterboxd RSS: "Movie Title, ★★★★½"
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
