import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { SearchModule } from './search/search.module';
import { DirectorsModule } from './directors/directors.module';
import { TmdbModule } from './tmdb/tmdb.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Rend les variables d'environnement accessibles partout
    MoviesModule, // Ajout de notre nouvelle slice
    SearchModule,
    DirectorsModule,
    TmdbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
