import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClaseDto } from '../../clase/clase.dto/clase.dto';
import { UsuarioDto } from '../../usuario/usuario.dto/usuario.dto';

export class BonoDto {
   @IsNumber()
   @IsNotEmpty()
   readonly monto: number;

   @IsNumber()
   @IsNotEmpty()
   readonly calificacion: number;

   @IsString()
   @IsNotEmpty()
   readonly palabraClave: string;

   @IsNumber()
   @IsNotEmpty()
   readonly id: number;

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => UsuarioDto) 
   readonly usuarioDTO: UsuarioDto[];

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => ClaseDto) 
   readonly claseDTO: ClaseDto[];
}