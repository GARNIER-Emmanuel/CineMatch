import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { GetCineScrollMoviesController } from './get-cinescroll-movies/get-cinescroll-movies.controller';
import { GetCineScrollMoviesService } from './get-cinescroll-movies/get-cinescroll-movies.service';
import { GetMovieTrailerController } from './get-movie-trailer/get-movie-trailer.controller';
import { GetMovieTrailerService } from './get-movie-trailer/get-movie-trailer.service';

@Module({
  controllers: [
    GetCineScrollMoviesController,
    GetMovieTrailerController,
    MoviesController, 
  ],
  providers: [
    MoviesService, 
    GetCineScrollMoviesService,
    GetMovieTrailerService
  ],
})
export class MoviesModule {}
