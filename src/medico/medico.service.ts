import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js'; // injeção do serviço prisma para comunicação com o BD
import { CreateMedicoDto } from './dto/create-medico.dto.js';
import { UpdateMedicoDto } from './dto/update-medico.dto.js';
import { cpf } from 'cpf-cnpj-validator';

@Injectable()
export class MedicoService {

  constructor(private prisma: PrismaService) {}

  async create(createMedicoDto: CreateMedicoDto) {
    
    if (!cpf.isValid(createMedicoDto.cpf)){
      throw new BadRequestException("CPF inválido.")
    }

    return await this.prisma.medico.create({
      data: createMedicoDto,
    });
  }

  async findAll() {
    return this.prisma.medico.findMany();
  }

  async findOne(crm: string, crm_estado: string) {
    return await this.prisma.medico.findUnique({
      where: { crm_crm_estado:{
        crm,
        crm_estado,
      },
     },
    });
  }

  async update(crm: string, crm_estado: string, updateMedicoDto: UpdateMedicoDto) {
    return this.prisma.medico.update({
      where: { crm_crm_estado:{
        crm,
        crm_estado,
      },
     },
      data: updateMedicoDto,
    });
  }

  async remove(crm: string, crm_estado: string) {
    return this.prisma.medico.delete({
      where: { crm_crm_estado:{
        crm,
        crm_estado,
      },
     },
    });
  }
}
