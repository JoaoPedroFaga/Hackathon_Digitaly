import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsultasService } from './consultas.service.js';
import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { UpdateConsultaDto } from './dto/update-consulta.dto.js';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @Post()
  async create(@Body() createConsultaDto: CreateConsultaDto) {
    return this.consultasService.create(createConsultaDto);
  }

  @Get()
  async findAll() {
    return this.consultasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.consultasService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateConsultaDto: UpdateConsultaDto) {
      return this.consultasService.update(+id, updateConsultaDto);
    }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.consultasService.remove(+id);
  }
}
