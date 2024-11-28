import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BonoService } from './bono.service';
import { UsuarioService } from '../usuario/usuario.service';

@Controller('bono')
export class BonoController {
    constructor(private readonly bonoService: BonoService, UsuarioService: UsuarioService) {}

    @Post()
    async createBono(@Body() Bonos: any, Usuarios: any) {
      return await this.bonoService.createBono(Bonos, Usuarios);
    }
  
    @Get(':id')
    async findBonoById(@Param('id') id: number) {
      return await this.bonoService.findBonoById(id);
    }

    @Get(':id')
    async findAllBonosByUser(@Param('id') id: number) {
      return await this.bonoService.findAllBonosByUser(id);
    }
}
