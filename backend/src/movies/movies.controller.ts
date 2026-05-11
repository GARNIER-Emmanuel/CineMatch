import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { DiscoverMoviesDto } from './dto/discover-movies.dto';
import { Movie } from './interfaces/movie.interface';

@Controller('movies') // Définit la racine de l'URL : http://localhost:3000/movies
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  /**
   * Endpoint GET /movies/discover
   * @Query() permet de récupérer les paramètres de l'URL (?genres=28&page=2)
   */
  @Get('discover')
  async discover(@Query() filters: DiscoverMoviesDto): Promise<Movie[]> {
    // On délègue tout le travail au service
    return this.moviesService.discover(filters);
  }
}
