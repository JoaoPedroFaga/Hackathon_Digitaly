import { Test, TestingModule } from '@nestjs/testing';
import { MedicoController } from './medico.controller.js';
import { MedicoService } from './medico.service.js';

describe('MedicoController', () => {
  let controller: MedicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicoController],
      providers: [MedicoService],
    }).compile();

    controller = module.get<MedicoController>(MedicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
