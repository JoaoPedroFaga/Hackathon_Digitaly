import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClienteService } from './cliente.service.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clienteService.findAll();
  }

  @Get(':cpf')
  findOne(@Param('cpf') cpf: string) {
    return this.clienteService.findOne(cpf);
  }

  @Patch(':cpf')
  update(@Param('cpf') cpf: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(cpf, updateClienteDto);
  }

  @Delete(':cpf')
  remove(@Param('cpf') cpf: string) {
    return this.clienteService.remove(cpf);
  }

  @Post('login')
  login(@Body() credenciais: { email: string; senha: string }) {
    return this.clienteService.login(credenciais.email, credenciais.senha);
  }

}
