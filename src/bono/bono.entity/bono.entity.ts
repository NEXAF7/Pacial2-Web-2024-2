import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';

@Entity()
export class BonoEntity {
    @Column()
    monto: number;

    @Column()
    calificacion: number;

    @Column()
    palabraClave: String;

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.bonos)
    usuario: UsuarioEntity;

    @ManyToOne(() => ClaseEntity, clase => clase.bonos)
    clase: ClaseEntity;
}