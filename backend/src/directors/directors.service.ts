import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DirectorsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  private readonly epochs = [
    {
      title: "Âge d'Or d'Hollywood",
      directors: [
        { id: 2636, name: 'Alfred Hitchcock' },
        { id: 1032, name: 'John Ford' },
        { id: 2038, name: 'Orson Welles' },
        { id: 1564, name: 'Howard Hawks' },
        { id: 1774, name: 'Billy Wilder' },
        { id: 1111, name: 'Frank Capra' }
      ]
    },
    {
      title: "Nouvelle Vague & Cinéma Européen",
      directors: [
        { id: 1339, name: 'Jean-Luc Godard' },
        { id: 1121, name: 'François Truffaut' },
        { id: 4415, name: 'Federico Fellini' },
        { id: 38, name: 'Akira Kurosawa' },
        { id: 1686, name: 'Ingmar Bergman' },
        { id: 1177, name: 'Michelangelo Antonioni' }
      ]
    },
    {
      title: "Blockbusters & Nouvel Hollywood",
      directors: [
        { id: 488, name: 'Steven Spielberg' },
        { id: 1032, name: 'Martin Scorsese' },
        { id: 1776, name: 'Francis Ford Coppola' },
        { id: 240, name: 'George Lucas' },
        { id: 138, name: 'Stanley Kubrick' },
        { id: 578, name: 'Ridley Scott' }
      ]
    },
    {
      title: "Cinéma Contemporain",
      directors: [
        { id: 525, name: 'Christopher Nolan' },
        { id: 45388, name: 'Denis Villeneuve' },
        { id: 138, name: 'Quentin Tarantino' },
        { id: 138248, name: 'Greta Gerwig' },
        { id: 5655, name: 'Wes Anderson' },
        { id: 7467, name: 'David Fincher' }
      ]
    }
  ];

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
  }

  async getDirectorsByEpochs(): Promise<any[]> {
    try {
      const results: any[] = [];

      for (const epoch of this.epochs) {
        const directorsDetails = await Promise.all(
          epoch.directors.map(async (d) => {
            try {
              const res = await axios.get(`${this.baseUrl}/person/${d.id}`, {
                params: { api_key: this.apiKey, language: 'fr-FR' }
              });
              const data = res.data;
              return {
                id: data.id,
                name: data.name,
                image: data.profile_path ? `https://image.tmdb.org/t/p/w500${data.profile_path}` : null,
                biography: data.biography,
                birthday: data.birthday,
                deathday: data.deathday,
                placeOfBirth: data.place_of_birth
              };
            } catch (e) {
              return { ...d, image: null };
            }
          })
        );

        results.push({
          title: epoch.title,
          directors: directorsDetails
        });
      }

      return results;
    } catch (error) {
      throw new HttpException('TMDB API unavailable', HttpStatus.BAD_GATEWAY);
    }
  }
}
