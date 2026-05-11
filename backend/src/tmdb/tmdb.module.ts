import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { TmdbController } from './tmdb.controller';

@Module({
  providers: [TmdbService],
  controllers: [TmdbController]
})
export class TmdbModule {}
