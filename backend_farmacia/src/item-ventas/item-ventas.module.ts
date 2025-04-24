import { Module } from '@nestjs/common';
import { ItemVentasService } from './item-ventas.service';
import { ItemVentasController } from './item-ventas.controller';

@Module({
  controllers: [ItemVentasController],
  providers: [ItemVentasService],
})
export class ItemVentasModule {}
