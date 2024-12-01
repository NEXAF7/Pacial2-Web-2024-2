import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClaseDto } from '../../clase/clase.dto/clase.dto';
import { BonoDto } from '../../bono/bono.dto/bono.dto';

export class UsuarioDto {
   @IsString()
   @IsNotEmpty()
   readonly cedula: number;

   @IsString()
   @IsNotEmpty()
   readonly nombre: string;

   @IsString()
   @IsNotEmpty()
   readonly grupoInvestigacion: string;

   @IsNumber()
   @IsNotEmpty()
   readonly numeroExtension: number;

   @IsString()
   @IsNotEmpty()
   readonly rol: string;

   @IsString()
   @IsNotEmpty()
   readonly jefe: string;

   @IsNumber()
   @IsNotEmpty()
   readonly id: number;

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => BonoDto) 
   readonly bonoDTO: BonoDto[];

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => ClaseDto) 
   readonly claseDTO: ClaseDto[];
}