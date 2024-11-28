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
        private readonly UsuarioRepository: Repository<UsuarioEntity>,

    ){}

    async createUsuario(Usuario: UsuarioEntity) {
        if (Usuario.grupoInvestigacion != "TICSW", "IMAGINE", "COMIT") {
          throw new BusinessLogicException(
            'The user should be in : TICSW, IMAGINE, COMIT.',
            BusinessError.BAD_REQUEST,
          );
        }
        if (Usuario.rol == null ||
            Usuario.rol.trim() == '' ||
            Usuario.rol.length < 8)
        {
            throw new BusinessLogicException("The role is not valid", BusinessError.BAD_REQUEST);
        }
        else {
            return await this.UsuarioRepository.save(Usuario);
        }
    }

    async findUsuarioById(id: number): Promise<UsuarioEntity> {
        const Usuario: UsuarioEntity = await this.UsuarioRepository.findOne({where: {id}, relations: ["clases", "bonos"] } );
        if (!Usuario)
        throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
      return Usuario;
    }        

      async deleteUsuarioById (id: number) {
        const Usuario: UsuarioEntity = await this.UsuarioRepository.findOne({
          where: { id },
        });
        if (!Usuario)
          throw new BusinessLogicException(
            'The user with the given id was not found',
            BusinessError.NOT_FOUND,
          );
        await this.UsuarioRepository.remove(Usuario);
    }
}

