import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { DiscoverMoviesDto } from './dto/discover-movies.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  // On crée un faux service pour isoler le test du controller
  const mockMoviesService = {
    discover: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController], // Le controller à tester
      providers: [
        { provide: MoviesService, useValue: mockMoviesService }, // Injection du faux service
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /discover', () => {
    it('should call moviesService.discover with query parameters (US1-S1.1)', async () => {
      // Given
      const filters: DiscoverMoviesDto = { genres: '28' };

      // When
      await controller.discover(filters);

      // Then
      expect(service.discover).toHaveBeenCalledWith(filters);
    });
  });
});
