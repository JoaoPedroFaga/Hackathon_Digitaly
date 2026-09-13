import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicoService } from './medico.service.js';
import { CreateMedicoDto } from './dto/create-medico.dto.js';
import { UpdateMedicoDto } from './dto/update-medico.dto.js';

@Controller('medico')
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  @Post()
  create(@Body() createMedicoDto: CreateMedicoDto) {
    return this.medicoService.create(createMedicoDto);
  }

  @Get()
  findAll() {
    return this.medicoService.findAll();
  }

  @Get(':crm/:crm_estado')
  findOne(
    @Param('crm') crm: string,
    @Param('crm_estado') crm_estado: string
) {
    return this.medicoService.findOne(crm, crm_estado);
  }

  @Patch(':crm/:crm_estado')
  update(
    @Param('crm') crm: string, 
    @Param('crm_estado') crm_estado: string,
    @Body() updateMedicoDto: UpdateMedicoDto) {
    return this.medicoService.update(crm, crm_estado, updateMedicoDto);
  }

  @Delete(':crm/:crm_estado')
  remove(
    @Param('crm') crm: string, 
    @Param('crm_estado') crm_estado: string,
  ) {
    return this.medicoService.remove(crm, crm_estado);
  }

  @Post('login')
  login(@Body() credenciais: { email: string; senha: string }) {
    return this.medicoService.login(credenciais.email, credenciais.senha);
  }
}
