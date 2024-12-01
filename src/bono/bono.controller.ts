import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';
import { BonoDto } from './bono.dto/bono.dto';

@Controller('bonos')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
  constructor(
    private readonly bonoService: BonoService,
  ) {}

  @Post(':usuarioId')
  async create(
    @Param('usuarioId') usuarioId: number,
    @Body() bonoDto: BonoDto
  ) {
    const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
    return await this.bonoService.crearBono(bono, usuarioId);
  }
  
  @Get('codigo/:codigo')
  async findOneCodigo(@Param('codigo') codigo: string) {
    return await this.bonoService.findBonoByCodigo(codigo);
  }

  @Get(':bonoId')
  async findOne(@Param('bonoId') bonoId: number): Promise<BonoEntity> {
  return await this.bonoService.findBonoById(bonoId);
}


  @Get('usuario/:usuarioId')
  async findOneUsuario(@Param('usuarioId') usuarioId: number) {
    return await this.bonoService.findAllBonosByUsuario(usuarioId);
  }

  @Delete(':bonoId')
  @HttpCode(204) 
  async delete(@Param('bonoId') bonoId: number): Promise<void> {
    return await this.bonoService.deleteBonoById(bonoId);
  }
  

}
