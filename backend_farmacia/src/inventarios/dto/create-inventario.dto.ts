import { Type } from 'class-transformer';
import { IsDateString, IsDefined, IsInt, IsNotEmpty } from 'class-validator';
import { Distribuidora } from 'src/distribuidoras/entities/distribuidora.entity';
import { Producto } from 'src/productos/entities/producto.entity';

export class CreateInventarioDto {
  @Type(() => Number)
  @IsDefined({ message: 'El campo idProducto debe estar definido' })
  @IsInt({ message: 'El campo idProducto debe ser de tipo numérico' })
  readonly idProducto: Producto['id'];

  @Type(() => Number)
  @IsDefined({ message: 'El campo idDistribuidora debe estar definido' })
  @IsInt({ message: 'El campo idDistribuidora debe ser de tipo numérico' })
  readonly idDistribuidora: Distribuidora['id'];

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
