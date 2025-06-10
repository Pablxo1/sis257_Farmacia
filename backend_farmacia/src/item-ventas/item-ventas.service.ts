import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemVentaDto } from './dto/create-item-venta.dto';
import { UpdateItemVentaDto } from './dto/update-item-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemVenta } from './entities/item-venta.entity';
import { Repository } from 'typeorm';

@Injectable()
@Injectable()
export class ItemVentasService {
  constructor(
    @InjectRepository(ItemVenta)
    private readonly itemVentasRepository: Repository<ItemVenta>,
  ) {}

  async create(createItemVentaDto: CreateItemVentaDto): Promise<ItemVenta> {
    const existe = await this.itemVentasRepository.findOneBy({
      idVenta: createItemVentaDto.idVenta,
      idProducto: createItemVentaDto.idProducto,
    });

    if (existe)
      throw new ConflictException('El item de venta ya existe para esta venta y producto');

    const itemVenta = new ItemVenta();
    itemVenta.idVenta = createItemVentaDto.idVenta;
    itemVenta.idProducto = createItemVentaDto.idProducto;
    itemVenta.cantidad = createItemVentaDto.cantidad;
    itemVenta.precioUnitario = createItemVentaDto.precioUnitario;
    return this.itemVentasRepository.save(itemVenta);
  }

  async findAll(): Promise<ItemVenta[]> {
    return this.itemVentasRepository.find({
      relations: {
        producto: true,
        venta: { cliente: true },
      },
      select: {
        id: true,
        cantidad: true,
        precioUnitario: true,
        producto: { id: true, nombre: true },
        venta: { id: true, fecha: true, cliente: { id: true, nombre: true, apellido: true } },
      },
      order: { venta: { fecha: 'DESC' }, id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ItemVenta> {
    const itemVenta = await this.itemVentasRepository.findOne({
      where: { id },
      relations: { producto: true, venta: true },
    });

    if (!itemVenta) throw new NotFoundException('El item de venta no existe');
    return itemVenta;
  }

  async update(id: number, updateItemVentaDto: UpdateItemVentaDto): Promise<ItemVenta> {
    const itemVenta = await this.findOne(id);
    Object.assign(itemVenta, updateItemVentaDto);
    return this.itemVentasRepository.save(itemVenta);
  }

  async remove(id: number) {
    const itemVenta = await this.findOne(id);
    return this.itemVentasRepository.softRemove(itemVenta);
  }
}
