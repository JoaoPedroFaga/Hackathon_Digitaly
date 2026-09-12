import { Test, TestingModule } from '@nestjs/testing';
import { ConsultasService } from './consultas.service.js';

describe('ConsultasService', () => {
  let service: ConsultasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultasService],
    }).compile();

    service = module.get<ConsultasService>(ConsultasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
