import { Test, TestingModule } from '@nestjs/testing';
import { DirectorsService } from './directors.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DirectorsService', () => {
  let service: DirectorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DirectorsService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('mock-api-key') },
        },
      ],
    }).compile();

    service = module.get<DirectorsService>(DirectorsService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  it('devrait retourner des réalisateurs groupés par époques', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          { id: 1, name: 'Alfred Hitchcock', profile_path: '/hitch.jpg', known_for_department: 'Directing' }
        ]
      }
    });

    const epochs = await service.getDirectorsByEpochs();
    
    expect(epochs).toBeDefined();
    expect(epochs.length).toBeGreaterThan(0);
    expect(epochs[0].title).toBeDefined();
    expect(epochs[0].directors.length).toBeGreaterThan(0);
  });
});
