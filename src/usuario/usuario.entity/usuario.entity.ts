import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BonoEntity } from '../../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';

@Entity()
export class UsuarioEntity {
    @Column()
    cedula: number;
   
    @Column()
    nombre: String;
   
    @Column()
    grupoInvestigacion: String;
    
    @Column()
    numeroExtension: number;

    @Column()
    rol: String;

    @Column()
    jefe: String;
    
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @OneToMany(() => BonoEntity, bonos => bonos.usuario)
    bonos: BonoEntity[];

    @OneToMany(() => ClaseEntity, clases => clases.usuario)
    clases: ClaseEntity[];
}