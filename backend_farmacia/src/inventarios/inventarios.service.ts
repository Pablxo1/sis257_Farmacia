import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InventariosService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventariosRepository: Repository<Inventario>,
  ) {}

  async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    const existe = await this.inventariosRepository.findOneBy({
      idProducto: createInventarioDto.idProducto,
      idDistribuidora: createInventarioDto.idDistribuidora,
      fechaIngresoAlmacen: createInventarioDto.fechaIngresoAlmacen,
      fechaVencimiento: createInventarioDto.fechaVencimiento,
    });

    if (existe)
      throw new ConflictException(
        'El inventario ya existe para este producto, distribuidora y fechas',
      );

    const inventario = new Inventario();
    inventario.idProducto = createInventarioDto.idProducto;
    inventario.idDistribuidora = createInventarioDto.idDistribuidora;
    inventario.cantidad = createInventarioDto.cantidad;
    inventario.fechaIngresoAlmacen = createInventarioDto.fechaIngresoAlmacen;
    inventario.fechaVencimiento = createInventarioDto.fechaVencimiento;
    return this.inventariosRepository.save(inventario);
  }

  async findAll(): Promise<Inventario[]> {
    return this.inventariosRepository.find({
      relations: { producto: true, distribuidora: true },
      select: {
        id: true,
        cantidad: true,
        fechaIngresoAlmacen: true,
        fechaVencimiento: true,
        distribuidora: { id: true, nombre: true },
        producto: { id: true, nombre: true, presentacion: true, concentracion: true },
      },
      order: { fechaIngresoAlmacen: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Inventario> {
    const inventario = await this.inventariosRepository.findOne({
      where: { id },
      relations: { producto: true, distribuidora: true },
    });

    if (!inventario) throw new NotFoundException('El inventario no existe');
    return inventario;
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.findOne(id);
    Object.assign(inventario, updateInventarioDto);
    return this.inventariosRepository.save(inventario);
  }

  async remove(id: number) {
    const inventario = await this.findOne(id);
    return this.inventariosRepository.softRemove(inventario);
  }
}
