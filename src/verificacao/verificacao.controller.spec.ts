import { Test, TestingModule } from '@nestjs/testing';
import { VerificacaoController } from './verificacao.controller.js';
import { VerificacaoService } from './verificacao.service.js';

describe('VerificacaoController', () => {
  let controller: VerificacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificacaoController],
      providers: [VerificacaoService],
    }).compile();

    controller = module.get<VerificacaoController>(VerificacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
