import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
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

  async login(email: string, senhaDigitada: string) {
    // Busca o adm pelo e-mail
    const adm = await this.prisma.adm.findFirst({
      where: { email: email },
    });

    // Se não achar o e-mail ou a senha estiver errada, barra o acesso
    if (!adm || adm.senha !== senhaDigitada) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // Se deu certo, devolve o CPF para o frontend salvar no localStorage
    return {
      mensagem: 'Login aprovado',
      cpf: adm.cpf,
      nome: "admin", 
      sobrenome: "",
      email: adm.email 
    };
  }
}
