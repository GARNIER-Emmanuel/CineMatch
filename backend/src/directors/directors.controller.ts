import { Controller, Get } from '@nestjs/common';
import { DirectorsService } from './directors.service';

@Controller('directors')
export class DirectorsController {
  constructor(private readonly directorsService: DirectorsService) {}

  @Get('popular')
  async getPopularByEpochs(): Promise<any[]> {
    return this.directorsService.getDirectorsByEpochs();
  }
}
