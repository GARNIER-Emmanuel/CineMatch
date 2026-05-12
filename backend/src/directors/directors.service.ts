import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DirectorsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private directorsCache: any[] | null = null;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('TMDB_API_KEY') || '';
  }

  /**
   * Récupère une liste ultra-exhaustive et dynamique de réalisateurs importants.
   * Scanne les films cultes (Top Voted + Top Rated) et les personnalités populaires.
   */
  async getDirectorsByEpochs(): Promise<any[]> {
    if (this.directorsCache) return this.directorsCache;

    try {
      // 1. Scanner une large base de films (100 films les plus votés + 100 mieux notés)
      const movieIds = await this.getExtensiveMoviePool();
      
      // 2. Extraire les réalisateurs de ces films
      const directorIdsFromMovies = await this.getExtensiveDirectorIds(movieIds);
      
      // 3. Ajouter les 100 personnalités les plus populaires du moment (filtrées sur Directing)
      const popularDirectorIds = await this.getPopularDirectorIds();
      
      // Union des IDs pour éviter les doublons
      const allUniqueIds = Array.from(new Set([...directorIdsFromMovies, ...popularDirectorIds])).slice(0, 200);

      // 4. Récupérer les détails complets pour chaque réalisateur
      const directors = await this.fetchDirectorsDetails(allUniqueIds);

      // 5. Classer par époques basées sur l'année de naissance
      this.directorsCache = this.groupByEpochs(directors);
      return this.directorsCache;
    } catch (error) {
      console.error('[DirectorsService] Error:', error);
      throw new HttpException('Failed to fetch extensive directors', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getExtensiveMoviePool(): Promise<number[]> {
    const pages = [1, 2, 3, 4, 5]; 
    const topRatedPages = [1, 2, 3, 4, 5]; 
    
    const requests = [
      ...pages.map(p => axios.get(`${this.baseUrl}/discover/movie`, {
        params: { api_key: this.apiKey, sort_by: 'vote_count.desc', page: p, language: 'fr-FR' }
      })),
      ...topRatedPages.map(p => axios.get(`${this.baseUrl}/movie/top_rated`, {
        params: { api_key: this.apiKey, page: p, language: 'fr-FR' }
      }))
    ];

    const responses = await Promise.all(requests);
    return responses.flatMap(res => res.data.results.map((m: any) => m.id));
  }

  private async getPopularDirectorIds(): Promise<number[]> {
    const pages = [1, 2, 3, 4, 5]; 
    const requests = pages.map(p => axios.get(`${this.baseUrl}/person/popular`, {
      params: { api_key: this.apiKey, page: p, language: 'fr-FR' }
    }));

    const responses = await Promise.all(requests);
    return responses.flatMap(res => 
      res.data.results
        .filter((p: any) => p.known_for_department === 'Directing')
        .map((p: any) => p.id)
    );
  }

  private async getExtensiveDirectorIds(movieIds: number[]): Promise<number[]> {
    const directorIds = new Set<number>();
    
    // On limite à 120 films pour rester raisonnable sur les quotas API
    const limitedIds = movieIds.slice(0, 120);
    const creditsRequests = limitedIds.map(id => 
      axios.get(`${this.baseUrl}/movie/${id}/credits`, {
        params: { api_key: this.apiKey }
      }).catch(() => null)
    );

    const responses = await Promise.all(creditsRequests);
    responses.forEach(res => {
      if (res?.data?.crew) {
        const director = res.data.crew.find((m: any) => m.job === 'Director');
        if (director) directorIds.add(director.id);
      }
    });

    return Array.from(directorIds);
  }

  private async fetchDirectorsDetails(ids: number[]): Promise<any[]> {
    const requests = ids.map(id => 
      axios.get(`${this.baseUrl}/person/${id}`, {
        params: { api_key: this.apiKey, language: 'fr-FR' }
      }).catch(() => null)
    );

    const responses = await Promise.all(requests);
    return responses
      .filter(res => res !== null)
      .map(res => ({
        id: res.data.id,
        name: res.data.name,
        biography: res.data.biography,
        birthday: res.data.birthday,
        deathday: res.data.deathday,
        placeOfBirth: res.data.place_of_birth,
        image: res.data.profile_path ? `https://image.tmdb.org/t/p/w500${res.data.profile_path}` : null,
        birthYear: res.data.birthday ? parseInt(res.data.birthday.split('-')[0], 10) : null
      }))
      .filter(d => d.birthYear !== null); 
  }

  private groupByEpochs(directors: any[]): any[] {
    const epochs = [
      { title: 'Légendes de l\'Âge d\'Or (Nés < 1920)', min: 0, max: 1920, directors: [] as any[] },
      { title: 'Nouvel Hollywood & Europe (1920-1945)', min: 1920, max: 1945, directors: [] as any[] },
      { title: 'Grands Visionnaires (1945-1970)', min: 1945, max: 1970, directors: [] as any[] },
      { title: 'Maîtres Contemporains (Nés > 1970)', min: 1970, max: 3000, directors: [] as any[] }
    ];

    directors.forEach(d => {
      const epoch = epochs.find(e => d.birthYear >= e.min && d.birthYear < e.max);
      if (epoch) epoch.directors.push(d);
    });

    epochs.forEach(e => {
      e.directors.sort((a, b) => a.name.localeCompare(b.name));
    });

    return epochs.filter(e => e.directors.length > 0);
  }

  async getDirectorMovies(directorId: number): Promise<any[]> {
    try {
      const res = await axios.get(`${this.baseUrl}/person/${directorId}/movie_credits`, {
        params: { api_key: this.apiKey, language: 'fr-FR' }
      });

      const movies = res.data.crew
        .filter((m: any) => m.job === 'Director')
        .map((m: any) => ({
          id: m.id,
          title: m.title,
          overview: m.overview,
          releaseYear: m.release_date ? m.release_date.split('-')[0] : 'N/A',
          rating: m.vote_average ? m.vote_average.toFixed(1) : '0.0',
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : null
        }));

      return movies.sort((a: any, b: any) => b.releaseYear.localeCompare(a.releaseYear));
    } catch (error) {
      throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
    }
  }
}
