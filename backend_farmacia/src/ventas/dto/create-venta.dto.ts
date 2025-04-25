import { IsDateString, IsDefined, IsNumber } from 'class-validator';

export class CreateVentaDto {
  @IsDefined({ message: 'El campo fecha debe estar definido' })
  @IsDateString({}, { message: 'El campo fecha debe ser tipo fecha' })
  readonly fecha: Date;

  @IsDefined({ message: 'El campo total debe estar definido' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El total debe tener máximo 2 decimales' })
  readonly total: number;
}
