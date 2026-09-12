import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateMedicoDto } from './create-medico.dto.js';

export class UpdateMedicoDto extends PartialType(
    OmitType(CreateMedicoDto, ['cpf', 'crm', 'crm_estado'] as const)) {}
