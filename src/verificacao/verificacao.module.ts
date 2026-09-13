import { Module } from '@nestjs/common';
import { VerificacaoService } from './verificacao.service.js';
import { VerificacaoController } from './verificacao.controller.js';

@Module({
  controllers: [VerificacaoController],
  providers: [VerificacaoService],
})
export class VerificacaoModule {}
