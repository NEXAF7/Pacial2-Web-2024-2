import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';

@Injectable()
export class ClaseService {
    constructor(
        @InjectRepository(ClaseEntity)
        private readonly ClaseRepository: Repository<ClaseEntity>
    ){}

   async crearClase(clase: ClaseEntity): Promise<ClaseEntity> {
    if (!clase.codigo || clase.codigo.trim().length !== 10) {
        throw new BusinessLogicException(
            'The class code must be exactly 10 characters long',
            BusinessError.BAD_REQUEST,
        );
    }
    return await this.ClaseRepository.save(clase);
    }

    async findClaseById(id: number): Promise<ClaseEntity> {
        const clase: ClaseEntity = await this.ClaseRepository.findOne({
            where: {id},
            relations: ["bonos", "usuario"] } );
        if (!clase)
          throw new BusinessLogicException("The class with the given id was not found",
        BusinessError.NOT_FOUND);
   
        return clase;
    }
}