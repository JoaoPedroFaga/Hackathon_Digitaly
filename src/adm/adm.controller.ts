import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdmService } from './adm.service.js';
import { CreateAdmDto } from './dto/create-adm.dto.js';
import { UpdateAdmDto } from './dto/update-adm.dto.js';

@Controller('adm')
export class AdmController {
  constructor(private readonly admService: AdmService) {}

  @Post()
  create(@Body() createAdmDto: CreateAdmDto) {
    return this.admService.create(createAdmDto);
  }

  @Get()
  findAll() {
    return this.admService.findAll();
  }

  @Get(':cpf')
  findOne(@Param('cpf') cpf: string) {
    return this.admService.findOne(cpf);
  }

  @Patch(':cpf')
  update(@Param('cpf') cpf: string, @Body() updateAdmDto: UpdateAdmDto) {
    return this.admService.update(cpf, updateAdmDto);
  }

  @Delete(':cpf')
  remove(@Param('cpf') cpf: string) {
    return this.admService.remove(cpf);
  }
}
