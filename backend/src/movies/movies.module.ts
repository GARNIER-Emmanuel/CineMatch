import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  controllers: [MoviesController], // Déclare le controller
  providers: [MoviesService], // Déclare le service pour qu'il puisse être injecté
})
export class MoviesModule {}
