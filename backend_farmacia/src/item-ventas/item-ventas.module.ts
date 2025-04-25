import { Module } from '@nestjs/common';
import { ItemVentasService } from './item-ventas.service';
import { ItemVentasController } from './item-ventas.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemVenta } from './entities/item-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemVenta])],
  controllers: [ItemVentasController],
  providers: [ItemVentasService],
})
export class ItemVentasModule {}
