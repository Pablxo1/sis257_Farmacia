import { Module } from '@nestjs/common';
import { ItemVentasService } from './item-ventas.service';
import { ItemVentasController } from './item-ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemVenta } from './entities/item-venta.entity';
import { InventariosModule } from '../inventarios/inventarios.module';
import { VentasModule } from '../ventas/ventas.module';

@Module({
  imports: [TypeOrmModule.forFeature([ItemVenta]), InventariosModule, VentasModule],
  controllers: [ItemVentasController],
  providers: [ItemVentasService],
})
export class ItemVentasModule {}
