import { Module } from '@nestjs/common';
import { AdmService } from './adm.service.js';
import { AdmController } from './adm.controller.js';

@Module({
  controllers: [AdmController],
  providers: [AdmService],
})
export class AdmModule {}
