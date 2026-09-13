import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VerificacaoService } from './verificacao.service.js';
import { CreateVerificacaoDto } from './dto/create-verificacao.dto.js';
import { UpdateVerificacaoDto } from './dto/update-verificacao.dto.js';

@Controller('verificacao')
export class VerificacaoController {
  constructor(private readonly verificacaoService: VerificacaoService) {}

  @Post()
  create(@Body() createVerificacaoDto: CreateVerificacaoDto) {
    return this.verificacaoService.create(createVerificacaoDto);
  }

  @Get()
  findAll() {
    return this.verificacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.verificacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVerificacaoDto: UpdateVerificacaoDto) {
    return this.verificacaoService.update(+id, updateVerificacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.verificacaoService.remove(+id);
  }
}
