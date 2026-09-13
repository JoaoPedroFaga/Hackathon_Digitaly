import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultaDto } from './create-consulta.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateConsultaDto extends PartialType(CreateConsultaDto) {
  @IsOptional()
  @IsBoolean()
  cliente_conectado?: boolean;

  @IsOptional()
  @IsBoolean()
  medico_conectado?: boolean;

  @IsOptional()
  @IsBoolean()
  finalizada?: boolean; 
}