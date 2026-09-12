import { Test, TestingModule } from '@nestjs/testing';
import { AdmController } from './adm.controller.js';
import { AdmService } from './adm.service.js';

describe('AdmController', () => {
  let controller: AdmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdmController],
      providers: [AdmService],
    }).compile();

    controller = module.get<AdmController>(AdmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
