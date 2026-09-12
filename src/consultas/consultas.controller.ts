import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsultasService } from './consultas.service.js';
import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { UpdateConsultaDto } from './dto/update-consulta.dto.js';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @Post()
  create(@Body() createConsultaDto: CreateConsultaDto) {
    return this.consultasService.create(createConsultaDto);
  }

  @Get()
  findAll() {
    return this.consultasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.consultasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateConsultaDto: UpdateConsultaDto) {
    return this.consultasService.update(+id, updateConsultaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.consultasService.remove(+id);
  }
}
