import { Injectable } from '@nestjs/common';
import { CreateVerificacaoDto } from './dto/create-verificacao.dto.js';
import { UpdateVerificacaoDto } from './dto/update-verificacao.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VerificacaoService {

  constructor(private prisma: PrismaService) {}

  async create(createVerificacaoDto: CreateVerificacaoDto) {
    return await this.prisma.verificacao.create({
      data: createVerificacaoDto,
    });
  }

  async findAll() {
    return this.prisma.verificacao.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.verificacao.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateVerificacaoDto: UpdateVerificacaoDto) {
    return this.prisma.verificacao.update({
      where: { id },
      data: updateVerificacaoDto,
    });
  }

  async remove(id: number) {
    return this.prisma.verificacao.delete({
      where: { id },
    });
  }
}
