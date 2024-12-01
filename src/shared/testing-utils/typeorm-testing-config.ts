import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { BonoEntity } from '../../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [BonoEntity, ClaseEntity, UsuarioEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([BonoEntity, ClaseEntity, UsuarioEntity]),
];