import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Inventario } from 'src/inventarios/entities/inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Inventario])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
