import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';

@Entity()
export class BonoEntity {
    @Column()
    monto: number;

    @Column("float")
    calificacion: number;

    @Column()
    palabraClave: string;

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.bonos)
    usuario: UsuarioEntity;

    @ManyToOne(() => ClaseEntity, clase => clase.bonos)
    clase: ClaseEntity;
}