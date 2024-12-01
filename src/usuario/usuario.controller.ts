import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { UsuarioDto }  from '../usuario/usuario.dto/usuario.dto';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Post()
    async create(@Body() usuarioDTO: UsuarioDto) {
      const usuario = plainToInstance(UsuarioEntity, usuarioDTO);
      return await this.usuarioService.crearUsuario(usuario);
    }
  
    @Get(':usuarioId')
    async findOne(@Param('usuarioId') usuarioId: number) {
      return await this.usuarioService.findUsuarioById(usuarioId);
    }
  
    @Delete(':usuarioId')
    @HttpCode(204)
    async delete(@Param('usuarioId') usuarioId: number) {
      return await this.usuarioService.eliminarUsuario(usuarioId);
    }
}
