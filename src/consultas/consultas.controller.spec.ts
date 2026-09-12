import { Test, TestingModule } from '@nestjs/testing';
import { ConsultasController } from './consultas.controller.js';
import { ConsultasService } from './consultas.service.js';

describe('ConsultasController', () => {
  let controller: ConsultasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultasController],
      providers: [ConsultasService],
    }).compile();

    controller = module.get<ConsultasController>(ConsultasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
