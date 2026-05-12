import { Test, TestingModule } from '@nestjs/testing';
import { GetCineScrollMoviesController } from './get-cinescroll-movies.controller';
import { GetCineScrollMoviesService } from './get-cinescroll-movies.service';

describe('GetCineScrollMoviesController', () => {
  let controller: GetCineScrollMoviesController;
  let service: GetCineScrollMoviesService;

  const mockService = {
    execute: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetCineScrollMoviesController],
      providers: [
        { provide: GetCineScrollMoviesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<GetCineScrollMoviesController>(GetCineScrollMoviesController);
    service = module.get<GetCineScrollMoviesService>(GetCineScrollMoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.execute with dto', async () => {
    const dto = { genres: '28', page: 1 };
    await controller.getCineScrollMovies(dto);
    expect(service.execute).toHaveBeenCalledWith(dto);
  });
});
