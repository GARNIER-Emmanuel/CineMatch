import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { GetCineScrollMoviesController } from './get-cinescroll-movies/get-cinescroll-movies.controller';
import { GetCineScrollMoviesService } from './get-cinescroll-movies/get-cinescroll-movies.service';

@Module({
  controllers: [MoviesController, GetCineScrollMoviesController],
  providers: [MoviesService, GetCineScrollMoviesService],
})
export class MoviesModule {}
