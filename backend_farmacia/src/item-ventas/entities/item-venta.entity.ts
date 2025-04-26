import { Producto } from 'src/productos/entities/producto.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('item_ventas')
export class ItemVenta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_venta' })
  idVenta: number;

  @Column('integer', { name: 'id_producto' })
  idProducto: number;

  @Column('int')
  cantidad: number;

  @Column('decimal', { name: 'precio_unitario', precision: 10, scale: 2 })
  precioUnitario: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Producto, producto => producto.itemsVentas)
  @JoinColumn({ name: 'id_itemVenta', referencedColumnName: 'id' })
  producto: Producto;

  @ManyToOne(() => Venta, venta => venta.itemVentas)
  @JoinColumn({ name: 'id_venta', referencedColumnName: 'id' })
  venta: Venta;
}
