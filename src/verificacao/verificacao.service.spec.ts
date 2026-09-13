import { Test, TestingModule } from '@nestjs/testing';
import { VerificacaoService } from './verificacao.service.js';

describe('VerificacaoService', () => {
  let service: VerificacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerificacaoService],
    }).compile();

    service = module.get<VerificacaoService>(VerificacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
