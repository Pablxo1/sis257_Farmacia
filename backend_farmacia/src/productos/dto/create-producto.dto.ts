import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombre no debe ser mayor a 100 caracteres' })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo descripcion no debe ser vacío' })
  @IsString({ message: 'El campo descripcion debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo descripcion no debe ser mayor a 255 caracteres' })
  readonly descripcion: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo presentacion no debe ser vacío' })
  @IsString({ message: 'El campo presentacion debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo presentacion no debe ser mayor a 100 caracteres' })
  readonly presentacion: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo concentracion no debe ser vacío' })
  @IsString({ message: 'El campo concentracion debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo concentracion no debe ser mayor a 100 caracteres' })
  readonly concentracion: string;

  @ApiProperty()
  @IsDefined({ message: 'El campo precio_venta debe estar definido' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio_venta debe tener máximo 2 decimales' })
  readonly precioVenta: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo precio_compra debe estar definido' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio_compra debe tener máximo 2 decimales' })
  readonly precioCompra: number;
}
