import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Movie } from './interfaces/movie.interface';
import { DiscoverMoviesDto } from './dto/discover-movies.dto';

@Injectable() // Dit à NestJS que cette classe peut être injectée (utilisée par d'autres composants)
export class MoviesService {
  private readonly apiKey: string; // Stocke la clé secrète pour appeler TMDB
  private readonly baseUrl = 'https://api.themoviedb.org/3'; // URL racine de l'API externe

  constructor(private configService: ConfigService) {
    // Récupère la clé API depuis la configuration globale du projet (.env)
    // On ajoute '|| \'\'' pour garantir que la valeur est une string, même si la clé est absente
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  /**
   * Méthode principale pour récupérer une liste de films selon des critères.
   * @param filters Les critères envoyés par l'utilisateur (genre, durée, etc.)
   * @returns Un tableau de 6 films formatés
   */
  async discover(filters: DiscoverMoviesDto): Promise<Movie[]> {
    try {
      // Appel réseau vers l'API TMDB avec les paramètres de filtrage
      const response = await axios.get(`${this.baseUrl}/discover/movie`, {
        params: {
          api_key: this.apiKey, // Authentification obligatoire
          with_genres: filters.genres, // Filtre par catégorie (ex: Action, Comédie)
          'with_runtime.lte': filters.maxDuration, // Durée maximale du film
          'vote_average.gte': filters.minRating || 6, // Note minimale (par défaut 6/10)
          page: filters.page || 1, // Page de résultats (par défaut la première)
          sort_by: 'vote_average.desc', // Tri par les mieux notés en premier
          language: 'fr-FR', // On veut les titres et descriptions en français
        },
      });

      // On transforme les données brutes reçues de TMDB en notre format simplifié
      const movies = response.data.results.slice(0, 6).map((movie: any) => ({
        id: movie.id, // Identifiant unique
        title: movie.title, // Titre du film
        overview: movie.overview, // Résumé de l'histoire
        // On extrait l'année de la date de sortie (ex: "2010-07-16" -> "2010")
        releaseYear: movie.release_date ? movie.release_date.split('-')[0] : '',
        rating: movie.vote_average.toString(), // Note moyenne
        // On construit l'URL complète de l'affiche (TMDB ne donne qu'un chemin partiel)
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      }));

      return movies; // On retourne notre liste propre de 6 films
    } catch (error: any) {
      // Gestion spécifique si la clé API n'est pas reconnue par TMDB (erreur 401)
      if (error.response?.status === 401) {
        throw new HttpException('Invalid TMDB API key', HttpStatus.UNAUTHORIZED);
      }
      // En cas de panne de TMDB ou problème réseau, on renvoie une erreur 502
      throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
    }
  }
}
