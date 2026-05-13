import { IsOptional, IsString, IsIn } from 'class-validator';

export class GetLetterboxdPicksDto {
  @IsOptional()
  @IsString()
  @IsIn(['all', 'best', 'worst'])
  filter?: string = 'all';
}
