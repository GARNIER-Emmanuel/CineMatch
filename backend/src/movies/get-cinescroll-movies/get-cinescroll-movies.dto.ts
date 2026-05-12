import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCineScrollMoviesDto {
  @IsOptional()
  @IsString()
  genres?: string;

  @IsOptional()
  @IsString()
  excludeGenres?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  releaseYearMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  releaseYearMin?: number;
}
