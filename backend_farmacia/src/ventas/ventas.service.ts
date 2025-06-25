import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DataSource, Repository } from 'typeorm';
import { ItemVenta } from 'src/item-ventas/entities/item-venta.entity';
import { CreateItemVentaDto } from 'src/item-ventas/dto/create-item-venta.dto';
import { InventariosService } from 'src/inventarios/inventarios.service';
@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta) private ventasRepository: Repository<Venta>,
    @InjectRepository(ItemVenta) private itemVentasRepository: Repository<ItemVenta>,
    private dataSource: DataSource,
    private inventariosService: InventariosService,
  ) {}

  async create(
    createVentaDto: CreateVentaDto,
    itemsDto: CreateItemVentaDto[],
    id: number,
  ): Promise<Venta> {
    return await this.dataSource.transaction(async manager => {
      const venta = manager.create(Venta, {
        idCliente: createVentaDto.idCliente,
        idUsuario: id,
        fecha: createVentaDto.fecha,
        total: createVentaDto.total,
        efectivo: createVentaDto.efectivo,
        cambio: createVentaDto.cambio,
      });
      const ventaGuardada = await manager.save(Venta, venta);

      for (const itemDto of itemsDto) {
        await this.inventariosService.descontarStock(itemDto.idProducto, itemDto.cantidad, manager);

        const itemVenta = manager.create(ItemVenta, {
          idVenta: ventaGuardada.id,
          idProducto: itemDto.idProducto,
          cantidad: itemDto.cantidad,
          precioUnitario: itemDto.precioUnitario,
        });
        await manager.save(ItemVenta, itemVenta);
      }

      return ventaGuardada;
    });
  }

  async findAll(): Promise<Venta[]> {
    return this.ventasRepository.find({
      relations: {
        cliente: true,
        usuario: true,
        itemVentas: { producto: true },
      },
      order: { fecha: 'DESC', id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: { cliente: true },
    });

    if (!venta) throw new NotFoundException('La venta no existe');
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);
    Object.assign(venta, updateVentaDto);
    return this.ventasRepository.save(venta);
  }

  async remove(id: number) {
    const venta = await this.findOne(id);
    if (venta) return this.ventasRepository.softRemove(venta);
  }
  async actualizarTotalVenta(idVenta: number) {
    const items = await this.itemVentasRepository.find({ where: { idVenta } });
    const total = items.reduce((sum, item) => sum + item.cantidad * Number(item.precioUnitario), 0);
    await this.ventasRepository.update(idVenta, { total });
  }
}
