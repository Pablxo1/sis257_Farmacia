import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsNumber } from 'class-validator';
import { Producto } from 'src/productos/entities/producto.entity';
import { Venta } from 'src/ventas/entities/venta.entity';

export class CreateItemVentaDto {
  @ApiProperty()
  @Type(() => Number)
  @IsDefined({ message: 'El campo idVenta debe estar definido' })
  @IsInt({ message: 'El campo idVenta debe ser de tipo numérico' })
  readonly idVenta: Venta['id'];

  @ApiProperty()
  @Type(() => Number)
  @IsDefined({ message: 'El campo idProducto debe estar definido' })
  @IsInt({ message: 'El campo idProducto debe ser de tipo numérico' })
  readonly idProducto: Producto['id'];

  @ApiProperty()
  @IsDefined({ message: 'El campo cantidad debe estar definido' })
  @IsInt({ message: 'El campo cantidad debe ser de tipo numérico' })
  readonly cantidad: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo precio_Unitario debe estar definido' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe tener máximo 2 decimales' })
  readonly precioUnitario: number;
}
