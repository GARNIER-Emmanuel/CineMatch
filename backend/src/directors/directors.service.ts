import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DirectorsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private directorsCache: any[] | null = null;
  private readonly dbPath = path.join(process.cwd(), 'src/data/directors-db.json');

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('TMDB_API_KEY') || '';
  }

  /**
   * Récupère la liste exhaustive des réalisateurs depuis la base de données locale (générée par le seeder).
   */
  async getDirectorsByEpochs(): Promise<any[]> {
    if (this.directorsCache) return this.directorsCache;

    try {
      // Lecture de la BDD NoSQL locale
      if (!fs.existsSync(this.dbPath)) {
        throw new Error(`La base de données ${this.dbPath} n'existe pas. Veuillez lancer le seeder.`);
      }

      const fileContent = fs.readFileSync(this.dbPath, 'utf-8');
      const directors = JSON.parse(fileContent);

      // Classer par époques
      this.directorsCache = this.groupByEpochs(directors);
      return this.directorsCache;
    } catch (error) {
      console.error('[DirectorsService] Error reading local DB:', error);
      throw new HttpException('Failed to fetch directors from local database', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
      // 1. Récupérer le département principal de la personne (Acteur ou Réalisateur)
      const personRes = await axios.get(`${this.baseUrl}/person/${directorId}`, {
        params: { api_key: this.apiKey, language: 'fr-FR' }
      });
      const department = personRes.data.known_for_department;

      // 2. Récupérer tous les crédits de films
      const res = await axios.get(`${this.baseUrl}/person/${directorId}/movie_credits`, {
        params: { api_key: this.apiKey, language: 'fr-FR' }
      });

      // 3. Sélectionner les bons films selon le métier
      let rawMovies = [];
      if (department === 'Acting') {
        rawMovies = res.data.cast || [];
      } else {
        rawMovies = res.data.crew?.filter((m: any) => m.job === 'Director') || [];
        // Fallback si la personne n'a rien réalisé mais a joué
        if (rawMovies.length === 0 && res.data.cast?.length > 0) {
          rawMovies = res.data.cast;
        }
      }

      // 4. Formater les résultats
      const movies = rawMovies.map((m: any) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        releaseYear: m.release_date ? m.release_date.split('-')[0] : 'N/A',
        rating: m.vote_average ? m.vote_average.toFixed(1) : '0.0',
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
        backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : null
      }));

      // 5. Dédoublonner, filtrer les films inutiles (sans poster ou sans note) et trier par année
      const uniqueMovies = Array.from(new Map(movies.map((m: any) => [m.id, m])).values())
        .filter((m: any) => m.poster !== null && m.rating !== '0.0');

      return (uniqueMovies as any[]).sort((a: any, b: any) => b.releaseYear.localeCompare(a.releaseYear));
    } catch (error) {
      throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
    }
  }
}
