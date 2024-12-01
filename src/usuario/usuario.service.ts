import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { BonoEntity } from '../bono/bono.entity/bono.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async crearUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
    const grupoValido = ['TICSW', 'IMAGINE', 'COMIT'];
    if (!grupoValido.includes(usuario.grupoInvestigacion)) {
      throw new BusinessLogicException(
        'The user should be in one of the following groups: TICSW, IMAGINE, COMIT.',
        BusinessError.BAD_REQUEST,
      );
    }

    if (usuario.rol === 'Profesor') {
      if (!grupoValido.includes(usuario.grupoInvestigacion)) {
        throw new BusinessLogicException(
          'The investigarion group should be TICSW, IMAGINE o COMIT for profesor ',
          BusinessError.BAD_REQUEST,
        );
      }
    }

    if (usuario.rol === 'Decana') {
      const numeroExtension = usuario.numeroExtension.toString();
      if (numeroExtension.length !== 8) {
        throw new BusinessLogicException(
          'The number extension should be 8 digits for decana',
          BusinessError.BAD_REQUEST,
        );
      }
    }
    
    return await this.usuarioRepository.save(usuario);
  }

  async findUsuarioById(usuarioId: number): Promise<UsuarioEntity> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({ 
      where: { id: usuarioId },
      relations: ["bonos"],
    });
    

    if (!usuario) {
      throw new BusinessLogicException(
        'The id is not valid',
        BusinessError.NOT_FOUND,
      );
    }

    return usuario;
  }

  async eliminarUsuario(id: number): Promise<void> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['bonos'],
    });
  
    console.log('Usuario:', usuario);
    console.log('Usuario.bonos:', usuario?.bonos);
  
    if (!usuario) {
      throw new BusinessLogicException(
        'The user with the given ID was not found',
        BusinessError.NOT_FOUND,
      );
    }
  
    if (usuario.bonos && usuario.bonos.length > 0) {
      throw new BusinessLogicException(
        'The user cannot be deleted because it has associated bonos',
        BusinessError.BAD_REQUEST,
      );
    }
  
    await this.usuarioRepository.remove(usuario);
  }
  
  
  
}
