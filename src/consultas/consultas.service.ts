import { Injectable } from '@nestjs/common';
import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { UpdateConsultaDto } from './dto/update-consulta.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ConsultasService {

  constructor(private prisma: PrismaService) {}

  async create(createConsultaDto: CreateConsultaDto) {
    return await this.prisma.consultas.create({
      data: createConsultaDto,
    });
  }

  async findAll() {
    return this.prisma.consultas.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.consultas.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateConsultaDto: UpdateConsultaDto) {
    return this.prisma.consultas.update({
      where: { id },
      data: updateConsultaDto,
    });
  }

  async remove(id: number) {
    return this.prisma.consultas.delete({
      where: { id },
    });
  }
}
