import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { ClaseDto } from './clase.dto/clase.dto';

@Controller('clases')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
    constructor(private readonly claseService: ClaseService) {}

    @Post()
    async create(@Body() claseDTO: ClaseDto) {
      const clase = plainToInstance(ClaseEntity, claseDTO);
      return await this.claseService.crearClase(clase);
    }

  @Get(':claseId')
  async findOne(@Param('claseId') claseId: number) {
    return await this.claseService.findClaseById(claseId);
  }
}
