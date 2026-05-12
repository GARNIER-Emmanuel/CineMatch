import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  constructor(private configService: ConfigService) {}

  async search(query: string): Promise<any[]> {
    // TODO: Implémenter la recherche TMDB
    return [];
  }
}
