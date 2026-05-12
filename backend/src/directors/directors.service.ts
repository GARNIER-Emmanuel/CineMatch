import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DirectorsService {
  constructor(private configService: ConfigService) {}

  async getDirectorsByEpochs(): Promise<any[]> {
    return [];
  }
}
