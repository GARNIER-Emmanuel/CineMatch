import { Controller, Get, Param } from '@nestjs/common';
import { DirectorsService } from './directors.service';

@Controller('directors')
export class DirectorsController {
  constructor(private readonly directorsService: DirectorsService) {}

  @Get('popular')
  async getPopularByEpochs(): Promise<any[]> {
    return this.directorsService.getDirectorsByEpochs();
  }

  @Get(':id/movies')
  async getMovies(@Param('id') id: string): Promise<any[]> {
    return this.directorsService.getDirectorMovies(+id);
  }
}
