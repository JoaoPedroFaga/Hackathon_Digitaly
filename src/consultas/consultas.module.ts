import { Module } from '@nestjs/common';
import { ConsultasService } from './consultas.service.js';
import { ConsultasController } from './consultas.controller.js';

@Module({
  controllers: [ConsultasController],
  providers: [ConsultasService],
})
export class ConsultasModule {}
