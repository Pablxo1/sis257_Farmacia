import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { ItemVenta } from '../item-ventas/entities/item-venta.entity';
import { InventariosModule } from 'src/inventarios/inventarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, ItemVenta]), InventariosModule],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}
