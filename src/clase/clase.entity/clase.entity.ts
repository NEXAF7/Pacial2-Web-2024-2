import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { BonoEntity } from '../../bono/bono.entity/bono.entity';

@Entity()
export class ClaseEntity {
    @Column()
    nombre: string;

    @Column()
    codigo: string;
   
    @Column()
    numeroCreditos: number;

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => BonoEntity, bonos => bonos.clase)
    bonos: BonoEntity[];

    @ManyToOne(() => UsuarioEntity, usuario => usuario.clases)
    usuario: UsuarioEntity;
}