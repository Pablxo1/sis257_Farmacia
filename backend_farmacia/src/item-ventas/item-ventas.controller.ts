import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemVentasService } from './item-ventas.service';
import { CreateItemVentaDto } from './dto/create-item-venta.dto';
import { UpdateItemVentaDto } from './dto/update-item-venta.dto';

@Controller('item-ventas')
export class ItemVentasController {
  constructor(private readonly itemVentasService: ItemVentasService) {}

  @Post()
  create(@Body() createItemVentaDto: CreateItemVentaDto) {
    return this.itemVentasService.create(createItemVentaDto);
  }

  @Get('venta/:idVenta')
  async findByVenta(@Param('idVenta') idVenta: number) {
    return this.itemVentasService.findByVenta(idVenta);
  }
}
