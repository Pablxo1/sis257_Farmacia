import { IsDateString, IsDefined, IsInt, IsNotEmpty } from 'class-validator';

export class CreateInventarioDto {
  @IsDefined({ message: 'El campo cantidad debe estar definido' })
  @IsInt({ message: 'El campo cantidad debe ser de tipo numérico' })
  readonly cantidad: number;

  @IsDefined({ message: 'El campo fecha_Ingreso_Almacen debe estar definido' })
  @IsDateString({}, { message: 'El campo fecha_Ingreso_Almacen debe ser tipo fecha' })
  readonly fechaIngresoAlmacen: Date;

  @IsDefined({ message: 'El campo fecha_Vencimiento debe estar definido' })
  @IsDateString({}, { message: 'El campo fecha_Vencimiento debe ser tipo fecha' })
  readonly fechaVencimiento: Date;
}
