import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsDefined, IsInt } from 'class-validator';
import { Distribuidora } from 'src/distribuidoras/entities/distribuidora.entity';
import { Producto } from 'src/productos/entities/producto.entity';

export class CreateInventarioDto {
  @ApiProperty()
  @Type(() => Number)
  @IsDefined({ message: 'El campo idProducto debe estar definido' })
  @IsInt({ message: 'El campo idProducto debe ser de tipo numérico' })
  readonly idProducto: Producto['id'];

  @ApiProperty()
  @Type(() => Number)
  @IsDefined({ message: 'El campo idDistribuidora debe estar definido' })
  @IsInt({ message: 'El campo idDistribuidora debe ser de tipo numérico' })
  readonly idDistribuidora: Distribuidora['id'];

  @ApiProperty()
  @IsDefined({ message: 'El campo cantidad debe estar definido' })
  @IsInt({ message: 'El campo cantidad debe ser de tipo numérico' })
  readonly cantidad: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo fecha_Ingreso_Almacen debe estar definido' })
  @IsDateString({}, { message: 'El campo fecha_Ingreso_Almacen debe ser tipo fecha' })
  readonly fechaIngresoAlmacen: Date;

  @ApiProperty()
  @IsDefined({ message: 'El campo fecha_Vencimiento debe estar definido' })
  @IsDateString({}, { message: 'El campo fecha_Vencimiento debe ser tipo fecha' })
  readonly fechaVencimiento: Date;
}
