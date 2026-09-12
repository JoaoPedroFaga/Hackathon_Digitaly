import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { ClienteModule } from './cliente/cliente.module.js';
import { MedicoModule } from './medico/medico.module.js';
import { AdmModule } from './adm/adm.module.js';
import { ConsultasModule } from './consultas/consultas.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Transforma sua pasta 'html' na raiz do seu site
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'html'),
    }),
    PrismaModule,
    ClienteModule,
    MedicoModule,
    AdmModule,
    ConsultasModule,
  ],
  controllers: [], // Deixamos vazio, não precisamos mais do AppController
  providers: [],   // Deixamos vazio, não precisamos mais do AppService
})
export class AppModule {}