import { Controller, Get, Query } from '@nestjs/common';
import { GetLetterboxdPicksService } from './get-letterboxd-picks.service';
import { GetLetterboxdPicksDto } from './get-letterboxd-picks.dto';

@Controller('movies')
export class GetLetterboxdPicksController {
  constructor(private readonly getLetterboxdPicksService: GetLetterboxdPicksService) {}

  @Get('letterboxd-picks')
  async getPicks(@Query() query: GetLetterboxdPicksDto) {
    return this.getLetterboxdPicksService.execute(query.filter);
  }
}
