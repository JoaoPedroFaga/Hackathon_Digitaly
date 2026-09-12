import { PartialType , OmitType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto.js';

export class UpdateClienteDto extends PartialType(
  OmitType(CreateClienteDto, ['cpf'] as const) // impede que o CPF seja alterado
) {}