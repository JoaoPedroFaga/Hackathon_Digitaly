import { PartialType } from '@nestjs/mapped-types';
import { CreateVerificacaoDto } from './create-verificacao.dto.js';

export class UpdateVerificacaoDto extends PartialType(CreateVerificacaoDto) {}
