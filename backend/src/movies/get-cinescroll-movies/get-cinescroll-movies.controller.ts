import { Controller, Get, Query } from '@nestjs/common';
import { GetCineScrollMoviesService, CineScrollMovie } from './get-cinescroll-movies.service';
import { GetCineScrollMoviesDto } from './get-cinescroll-movies.dto';

@Controller('movies')
export class GetCineScrollMoviesController {
  constructor(private readonly service: GetCineScrollMoviesService) {}

  @Get('cinescroll')
  async getCineScrollMovies(@Query() dto: GetCineScrollMoviesDto): Promise<CineScrollMovie[]> {
    return this.service.execute(dto);
  }
}
