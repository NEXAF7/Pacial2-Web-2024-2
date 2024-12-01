import { Column, Entity, OneToMany, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BonoEntity } from '../../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';

@Entity()
export class UsuarioEntity {
    @Column()
    cedula: number;
   
    @Column()
    nombre: string;
   
    @Column()
    grupoInvestigacion: string;
    
    @Column()
    numeroExtension: number;

    @Column()
    rol: string;
    
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => BonoEntity, bonos => bonos.usuario)
    bonos: BonoEntity[];

    @OneToMany(() => ClaseEntity, clases => clases.usuario)
    clases: ClaseEntity[];

    @OneToOne(() => UsuarioEntity, (jefe) => jefe.usuario)
    @JoinColumn()
    usuario: UsuarioEntity;
}