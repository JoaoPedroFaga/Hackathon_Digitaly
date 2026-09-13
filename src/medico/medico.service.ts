import { BadRequestException, Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
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

    const cpfExistente = await this.prisma.medico.findUnique({
      where: { cpf: createMedicoDto.cpf },
    });

    if (cpfExistente) {
      throw new ConflictException('Usuário já está cadastrado.');
    }

    const crmExistente = await this.prisma.medico.findUnique({
      where: { 
        crm_crm_estado: {
          crm: createMedicoDto.crm,
          crm_estado: createMedicoDto.crm_estado
        }
      },
    });

    if (crmExistente) {
      throw new ConflictException('Usuário já está cadastrado.');
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

  async login(email: string, senhaDigitada: string) {
    // Busca o medico pelo e-mail
    const medico = await this.prisma.medico.findFirst({
      where: { email: email },
    });

    // Se não achar o e-mail ou a senha estiver errada, barra o acesso
    if (!medico || medico.senha !== senhaDigitada) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // Se deu certo, devolve o CPF para o frontend salvar no localStorage
    return {
      mensagem: 'Login aprovado',
      cpf: medico.cpf,
      nome: medico.nome, 
      sobrenome: medico.sobrenome, 
      email: medico.email
    };
  }
}
