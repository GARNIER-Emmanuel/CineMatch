import { Test, TestingModule } from '@nestjs/testing';
import { GetMovieTrailerController } from './get-movie-trailer.controller';
import { GetMovieTrailerService } from './get-movie-trailer.service';

describe('GetMovieTrailerController', () => {
  let controller: GetMovieTrailerController;
  let service: GetMovieTrailerService;

  const mockService = {
    execute: jest.fn().mockResolvedValue({ youtubeKey: '123' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetMovieTrailerController],
      providers: [
        { provide: GetMovieTrailerService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<GetMovieTrailerController>(GetMovieTrailerController);
    service = module.get<GetMovieTrailerService>(GetMovieTrailerService);
  });

  it('should call service.execute with movie id', async () => {
    await controller.getTrailer(123);
    expect(service.execute).toHaveBeenCalledWith(123);
  });
});
