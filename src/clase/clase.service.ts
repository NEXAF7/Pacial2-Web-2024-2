import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from'../usuario/usuario.entity/usuario.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { BonoEntity } from '../bono/bono.entity/bono.entity';

@Injectable()
export class ClaseService {
    constructor(
        @InjectRepository(ClaseEntity)
        private readonly ClaseRepository: Repository<ClaseEntity>
    ){}

    async createClase(Clase: ClaseEntity): Promise<ClaseEntity> {
        if (Clase.codigo == null ||
            Clase.codigo.trim() == '' ||
            Clase.codigo.length == 10)
        {
            throw new BusinessLogicException("The code is not valid", BusinessError.BAD_REQUEST);
        }
        else {
            return await this.ClaseRepository.save(Clase);
        }
    }

    async findClaseById(id: number): Promise<ClaseEntity> {
        const Clase: ClaseEntity = await this.ClaseRepository.findOne({where: {id}, relations: ["bonos", "usuario"] } );
        if (!Clase)
          throw new BusinessLogicException("The class with the given id was not found", BusinessError.NOT_FOUND);
   
        return Clase;
    }
}