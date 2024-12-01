import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  providers: [UsuarioService],
  exports: [UsuarioService],
  controllers: [UsuarioController]
})
export class UsuarioModule {}