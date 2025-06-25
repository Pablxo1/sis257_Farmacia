import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { CreateItemVentaDto } from 'src/item-ventas/dto/create-item-venta.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() body: { venta: CreateVentaDto; items: CreateItemVentaDto[] },
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.ventasService.create(body.venta, body.items, req.user.id);
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
