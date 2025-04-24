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

  @Get()
  findAll() {
    return this.itemVentasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemVentasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemVentaDto: UpdateItemVentaDto) {
    return this.itemVentasService.update(+id, updateItemVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemVentasService.remove(+id);
  }
}
