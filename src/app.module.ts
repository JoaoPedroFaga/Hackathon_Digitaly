import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ClienteModule } from './cliente/cliente.module.js';
import { MedicoModule } from './medico/medico.module.js';
import { AdmModule } from './adm/adm.module.js';
import { ConsultasModule } from './consultas/consultas.module.js';

@Module({
  imports: [PrismaModule, ClienteModule, MedicoModule, AdmModule, ConsultasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
