import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service.js';
import { MedicoController } from './medico.controller.js';

@Module({
  controllers: [MedicoController],
  providers: [MedicoService],
})
export class MedicoModule {}
