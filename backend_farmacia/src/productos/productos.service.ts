import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { Inventario } from '../inventarios/entities/inventario.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto) private readonly productosRepository: Repository<Producto>,
    @InjectRepository(Inventario) private readonly inventariosRepository: Repository<Inventario>,
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
    const inventarios = await this.inventariosRepository.count({ where: { idProducto: id } });
    if (inventarios > 0) {
      throw new BadRequestException('No se puede eliminar el producto porque está en inventario.');
    }
    return this.productosRepository.softRemove({ id });
  }
}
