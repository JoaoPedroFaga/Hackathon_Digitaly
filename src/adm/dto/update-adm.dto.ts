import { PartialType , OmitType } from '@nestjs/mapped-types';
import { CreateAdmDto } from './create-adm.dto.js';

export class UpdateAdmDto extends PartialType(
      OmitType(CreateAdmDto, ['cpf'] as const) // impede que o CPF seja alterado
) {}
