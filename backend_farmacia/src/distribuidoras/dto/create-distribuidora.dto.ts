import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDistribuidoraDto {
  @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombre no debe ser mayor a 100 caracteres' })
  readonly nombre: string;

  @IsNotEmpty({ message: 'El campo telefono no debe ser vacío' })
  @IsString({ message: 'El campo telefono debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo telefono no debe ser mayor a 100 caracteres' })
  readonly telefono: string;

  @IsNotEmpty({ message: 'El campo direccion no debe ser vacío' })
  @IsString({ message: 'El campo direccion debe ser de tipo cadena' })
  @MaxLength(255, { message: 'El campo direccion no debe ser mayor a 255 caracteres' })
  readonly direccion: string;

  @IsNotEmpty({ message: 'El campo email no debe ser vacío' })
  @IsString({ message: 'El campo email debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo email no debe ser mayor a 100 caracteres' })
  readonly email: string;
}
