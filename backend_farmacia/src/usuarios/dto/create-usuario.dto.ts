import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'El campo usuario no debe ser vacío' })
  @IsString({ message: 'El campo usuario debe ser de tipo cadena' })
  @MaxLength(15, { message: 'El campo usuario no debe ser mayor a 15 caracteres' })
  readonly usuario: string;

  @IsNotEmpty({ message: 'El campo clave no debe ser vacío' })
  @IsString({ message: 'El campo clave debe ser de tipo cadena' })
  @MaxLength(250, { message: 'El campo clave no debe ser mayor a 250 caracteres' })
  readonly clave: string;

  @IsNotEmpty({ message: 'El campo email no debe ser vacío' })
  @IsString({ message: 'El campo email debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo email no debe ser mayor a 50 caracteres' })
  readonly email: string;
}
