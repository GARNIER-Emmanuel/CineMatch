import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { DiscoverMoviesDto } from './dto/discover-movies.dto';
import { Movie } from './interfaces/movie.interface';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('discover')
  async discover(@Query() filters: DiscoverMoviesDto): Promise<Movie[]> {
    return this.moviesService.discover(filters);
  }

  @Get('directors/popular')
  getPopularDirectors(@Query('page') page?: number) {
    return this.moviesService.getPopularDirectors(page);
  }

  @Get('directors/:id')
  getDirectorDetails(@Param('id') id: number) {
    return this.moviesService.getDirectorDetails(id);
  }

  @Get(':id/providers')
  async getProviders(@Param('id') id: string): Promise<any[]> {
    return this.moviesService.getWatchProviders(parseInt(id, 10));
  }

  @Get(':id/images')
  async getImages(@Param('id') id: string): Promise<string[]> {
    return this.moviesService.getMovieImages(parseInt(id, 10));
  }

  @Get(':id/credits')
  async getCredits(@Param('id') id: string): Promise<{ director: string; cast: string[]; runtime: number }> {
    return this.moviesService.getCredits(parseInt(id, 10));
  }
}
