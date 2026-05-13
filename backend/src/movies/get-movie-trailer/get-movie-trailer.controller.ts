import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GetMovieTrailerService, MovieTrailer } from './get-movie-trailer.service';

@Controller('movies')
export class GetMovieTrailerController {
  constructor(private readonly service: GetMovieTrailerService) {}

  @Get('trailer/:id')
  async getTrailer(@Param('id', ParseIntPipe) id: number): Promise<MovieTrailer | null> {
    return this.service.execute(id);
  }
}
