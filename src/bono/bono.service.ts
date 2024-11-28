import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from'../usuario/usuario.entity/usuario.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class BonoService {
    constructor(
        @InjectRepository(BonoEntity)
        private readonly BonoRepository: Repository<BonoEntity>,

        @InjectRepository(UsuarioEntity)
        private readonly UsuarioService: UsuarioService,

    ){}

    async createBono(Bono: BonoEntity, Usuario: UsuarioEntity) {
        if (Bono.monto > 0) {
          throw new BusinessLogicException(
            'The bonus should be positive',
            BusinessError.BAD_REQUEST,
          );
        }
        if (Usuario.rol == null ||
            Usuario.rol.trim() == '' ||
            Usuario.rol.length < 8)
        {
            throw new BusinessLogicException("The bonus is not valid", BusinessError.BAD_REQUEST);
        }
        else {
            return await this.BonoRepository.save(Bono);
        }
    }

    async findBonoById(id: number): Promise<BonoEntity> {
        const Bono: BonoEntity = await this.BonoRepository.findOne({where: {id}, relations: ["clases", "bonos"] } );
        if (!Bono)
        throw new BusinessLogicException("The Bono with the given id was not found", BusinessError.NOT_FOUND);
      return Bono;
    }        

    async findAllBonosByUser(id: number): Promise<BonoEntity> {
        const Usuario: BonoEntity = await this.BonoRepository.findOne({where: {id}, relations: ["clases", "usuario"] } );
        if (!Usuario)
        throw new BusinessLogicException("The Bono with the given user was not found", BusinessError.NOT_FOUND);
      return Usuario;
    }    

      async deleteBonoById (id: number) {
        const Bono: BonoEntity = await this.BonoRepository.findOne({
          where: { id },
        });
        if (!Bono)
          throw new BusinessLogicException(
            'The bonus with the given id was not found',
            BusinessError.NOT_FOUND,
          );
        await this.BonoRepository.remove(Bono);
    }
}

