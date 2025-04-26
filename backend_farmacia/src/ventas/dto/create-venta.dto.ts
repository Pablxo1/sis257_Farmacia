import { Type } from 'class-transformer';
import { IsDateString, IsDefined, IsInt, IsNumber } from 'class-validator';
import { Cliente } from 'src/clientes/entities/cliente.entity';

export class CreateVentaDto {
  @Type(() => Number)
  @IsDefined({ message: 'El campo idCliente debe estar definido' })
  @IsInt({ message: 'El campo idCliente debe ser de tipo numérico' })
  readonly idCliente: Cliente['id'];

  @IsDefined({ message: 'El campo fecha debe estar definido' })
  @IsDateString({}, { message: 'El campo fecha debe ser tipo fecha' })
  readonly fecha: Date;

  @IsDefined({ message: 'El campo total debe estar definido' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El total debe tener máximo 2 decimales' })
  readonly total: number;
}
