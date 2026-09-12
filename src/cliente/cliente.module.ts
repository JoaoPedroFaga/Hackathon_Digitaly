import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service.js';
import { ClienteController } from './cliente.controller.js';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule {}
