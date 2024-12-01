import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async crearBono(bono: BonoEntity, usuarioId: number): Promise<BonoEntity> {
    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException('The user does not exist');
    }
  
    if (bono.monto <= 0) {
      throw new BusinessLogicException(
        'The bonus amount should be positive',
        BusinessError.BAD_REQUEST,
      );
    }
  
    if (!usuario.rol || usuario.rol !== 'Profesor') {
      throw new BusinessLogicException(
        'Only professors can create bonuses',
        BusinessError.BAD_REQUEST,
      );
    }
  
    bono.usuario = usuario;
    return this.bonoRepository.save(bono);
  }

  async findBonoByCodigo(codigo: string): Promise<BonoEntity> {
    const bono = await this.bonoRepository.findOne({
      where: { palabraClave: codigo },
      relations: ['usuario'],
    });
    
    if (!bono) {
      throw new Error('The bonus with the given ID was not found');
    }
    return bono;
  }
  
  async findBonoById(id: number): Promise<BonoEntity> {
    const bono = await this.bonoRepository.findOne({
      where: { id },
      relations: ['usuario', 'clase'],
    });
  
    if (!bono) {
      throw new NotFoundException('The bonus with the given ID was not found');
    }
  
    return bono;
  }
  
  
  async findAllBonosByUsuario(usuarioId: number): Promise<BonoEntity[]> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['bonos', 'bonos.usuario'],
    });
  
    if (!usuario) {
      throw new BusinessLogicException(
        'The bonus with ID was not found',
        BusinessError.NOT_FOUND,
      );
    }
  
    if (!usuario.bonos || usuario.bonos.length === 0) {
      throw new BusinessLogicException(
        'The user with the given ID does not have any bonuses',
        BusinessError.NOT_FOUND,
      );
    }
  
    return usuario.bonos;
  }
  
  async deleteBonoById(id: number): Promise<void> {
    const bono: BonoEntity = await this.bonoRepository.findOne({
      where: { id }
    });
    if (!bono) {
      throw new BusinessLogicException(
        'The bonus with the given ID was not found',
        BusinessError.NOT_FOUND,
      );
    }

    if (bono.calificacion > 4) {
      throw new BusinessLogicException(
        'The bonus cannot be deleted because the grade is above 4',
        BusinessError.BAD_REQUEST,
      );
    }

    await this.bonoRepository.remove(bono);
  }
}
