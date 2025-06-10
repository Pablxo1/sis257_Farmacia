import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private readonly productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const existe = await this.productosRepository.findOneBy({
      nombre: createProductoDto.nombre.trim(),
      descripcion: createProductoDto.descripcion.trim(),
      presentacion: createProductoDto.presentacion.trim(),
      concentracion: createProductoDto.concentracion.trim(),
      precioVenta: createProductoDto.precioVenta,
      precioCompra: createProductoDto.precioCompra,
    });

    if (existe) throw new ConflictException('El producto ya existe');

    const producto = new Producto();
    producto.nombre = createProductoDto.nombre.trim();
    producto.descripcion = createProductoDto.descripcion.trim();
    producto.presentacion = createProductoDto.presentacion.trim();
    producto.concentracion = createProductoDto.concentracion.trim();
    producto.precioVenta = createProductoDto.precioVenta;
    producto.precioCompra = createProductoDto.precioCompra;
    return this.productosRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOneBy({ id });
    if (!producto) throw new NotFoundException('El producto no existe');
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    const productoUpdate = Object.assign(producto, updateProductoDto);
    return this.productosRepository.save(productoUpdate);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    if (producto) return this.productosRepository.softRemove(producto);
  }
}
