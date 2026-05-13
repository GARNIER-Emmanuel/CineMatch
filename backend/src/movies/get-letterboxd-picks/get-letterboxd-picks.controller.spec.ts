import { Test, TestingModule } from '@nestjs/testing';
import { GetLetterboxdPicksController } from './get-letterboxd-picks.controller';
import { GetLetterboxdPicksService } from './get-letterboxd-picks.service';

describe('GetLetterboxdPicksController', () => {
  let controller: GetLetterboxdPicksController;
  let service: GetLetterboxdPicksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetLetterboxdPicksController],
      providers: [
        {
          provide: GetLetterboxdPicksService,
          useValue: {
            execute: jest.fn().mockResolvedValue([{ title: 'Inception' }]),
          },
        },
      ],
    }).compile();

    controller = module.get<GetLetterboxdPicksController>(GetLetterboxdPicksController);
    service = module.get<GetLetterboxdPicksService>(GetLetterboxdPicksService);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  it('devrait retourner les picks de Letterboxd', async () => {
    const result = await controller.getPicks({ filter: 'all' });
    expect(result).toEqual([{ title: 'Inception' }]);
    expect(service.execute).toHaveBeenCalledWith('all');
  });
});
