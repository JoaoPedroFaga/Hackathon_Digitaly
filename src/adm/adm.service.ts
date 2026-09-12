import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAdmDto } from './dto/create-adm.dto.js';
import { UpdateAdmDto } from './dto/update-adm.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { cpf } from 'cpf-cnpj-validator';

@Injectable()
export class AdmService {

  constructor(private prisma: PrismaService) {}

  async create(createAdmDto: CreateAdmDto) {

    if (!cpf.isValid(createAdmDto.cpf)){
      throw new BadRequestException("CPF inválido.")
    }

    return await this.prisma.adm.create({
      data: createAdmDto,
    });
  }

  async findAll() {
    return this.prisma.adm.findMany();
  }

  async findOne(cpf : string) {
    return await this.prisma.adm.findUnique({
      where: { cpf },
    });
  }

  async update(cpf: string, updateAdmDto: UpdateAdmDto) {
    return this.prisma.adm.update({
      where: { cpf },
      data: updateAdmDto,
    });
  }

  async remove(cpf: string) {
    return this.prisma.adm.delete({
      where: { cpf },
    });
  }
}
