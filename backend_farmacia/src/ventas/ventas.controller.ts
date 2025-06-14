import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { CreateItemVentaDto } from 'src/item-ventas/dto/create-item-venta.dto';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  create(@Body() body: { venta: CreateVentaDto; items: CreateItemVentaDto[] }) {
    return this.ventasService.create(body.venta, body.items);
  }

  @Get()
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventasService.update(+id, updateVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventasService.remove(+id);
  }
}
