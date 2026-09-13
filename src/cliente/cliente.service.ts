import { BadRequestException, Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { cpf } from 'cpf-cnpj-validator';

@Injectable()
export class ClienteService {

  constructor(private prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {

    if (!cpf.isValid(createClienteDto.cpf)){
      throw new BadRequestException("CPF inválido.")
    }

    const clienteExistente = await this.prisma.cliente.findUnique({
      where: { cpf: createClienteDto.cpf },
    });

    if (clienteExistente) {
      throw new ConflictException('Usuário já está cadastrado.');
    }

    return await this.prisma.cliente.create({
      data: createClienteDto,
    });
  }

  async findAll() {
    return this.prisma.cliente.findMany();
  }

  async findOne(cpf: string) {
    return await this.prisma.cliente.findUnique({
      where: { cpf },
    });
  }

  async update(cpf: string, updateClienteDto: UpdateClienteDto) {
    return this.prisma.cliente.update({
      where: { cpf },
      data: updateClienteDto,
    });
  }

  async remove(cpf: string) {
    return this.prisma.cliente.delete({
      where: { cpf },
    });
  }
}
