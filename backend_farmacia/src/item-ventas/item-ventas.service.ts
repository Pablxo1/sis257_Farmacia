import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemVenta } from './entities/item-venta.entity';
import { Repository } from 'typeorm';
import { CreateItemVentaDto } from './dto/create-item-venta.dto';
import { InventariosService } from 'src/inventarios/inventarios.service';
import { VentasService } from 'src/ventas/ventas.service';

@Injectable()
export class ItemVentasService {
  constructor(
    @InjectRepository(ItemVenta)
    private readonly itemVentasRepository: Repository<ItemVenta>,
    private readonly inventariosService: InventariosService,
    private readonly ventasService: VentasService,
  ) {}

  async create(createItemVentaDto: CreateItemVentaDto): Promise<ItemVenta> {
    const existe = await this.itemVentasRepository.findOneBy({
      idVenta: createItemVentaDto.idVenta,
      idProducto: createItemVentaDto.idProducto,
      idInventario: createItemVentaDto.idInventario,
    });
    if (existe)
      throw new ConflictException('El item de venta ya existe para esta venta y producto');

    await this.inventariosService.descontarStock(
      createItemVentaDto.idProducto,
      createItemVentaDto.cantidad,
    );

    const itemVenta = new ItemVenta();
    itemVenta.idVenta = createItemVentaDto.idVenta;
    itemVenta.idProducto = createItemVentaDto.idProducto;
    itemVenta.cantidad = createItemVentaDto.cantidad;
    itemVenta.precioUnitario = createItemVentaDto.precioUnitario;
    itemVenta.idInventario = createItemVentaDto.idInventario;

    if (createItemVentaDto.idInventario !== undefined) {
      itemVenta.idInventario = createItemVentaDto.idInventario;
    }

    const itemGuardado = await this.itemVentasRepository.save(itemVenta);

    await this.ventasService.actualizarTotalVenta(createItemVentaDto.idVenta);

    return itemGuardado;
  }
  async findByVenta(idVenta: number): Promise<ItemVenta[]> {
    return this.itemVentasRepository.find({
      where: { idVenta },
      relations: { producto: true },
    });
  }
}
