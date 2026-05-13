import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { GetCineScrollMoviesController } from './get-cinescroll-movies/get-cinescroll-movies.controller';
import { GetCineScrollMoviesService } from './get-cinescroll-movies/get-cinescroll-movies.service';
import { GetMovieTrailerController } from './get-movie-trailer/get-movie-trailer.controller';
import { GetMovieTrailerService } from './get-movie-trailer/get-movie-trailer.service';
import { GetLetterboxdPicksController } from './get-letterboxd-picks/get-letterboxd-picks.controller';
import { GetLetterboxdPicksService } from './get-letterboxd-picks/get-letterboxd-picks.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [
    GetCineScrollMoviesController,
    GetMovieTrailerController,
    GetLetterboxdPicksController,
    MoviesController, 
  ],
  providers: [
    MoviesService, 
    GetCineScrollMoviesService,
    GetMovieTrailerService,
    GetLetterboxdPicksService,
  ],
})
export class MoviesModule {}
