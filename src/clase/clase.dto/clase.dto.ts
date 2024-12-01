import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UsuarioDto } from '../../usuario/usuario.dto/usuario.dto';
import { BonoDto } from '../../bono/bono.dto/bono.dto';

export class ClaseDto {
   @IsString()
   @IsNotEmpty()
   readonly nombre: string;

   @IsString()
   @IsNotEmpty()
   readonly codigo: string;

   @IsNumber()
   @IsNotEmpty()
   readonly numeroCreditos: number;

   @IsNumber()
   @IsNotEmpty()
   readonly id: number;

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => BonoDto) 
   readonly bonoDTO: BonoDto[];

   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => UsuarioDto) 
   readonly usuarioDTO: UsuarioDto[];
}