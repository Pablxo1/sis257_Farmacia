import { IsDefined, IsInt, IsNumber } from 'class-validator';

export class CreateItemVentaDto {
  @IsDefined({ message: 'El campo cantidad debe estar definido' })
  @IsInt({ message: 'El campo cantidad debe ser de tipo numérico' })
  readonly cantidad: number;

  @IsDefined({ message: 'El campo precio_Unitario debe estar definido' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe tener máximo 2 decimales' })
  readonly precioUnitario: number;
}
