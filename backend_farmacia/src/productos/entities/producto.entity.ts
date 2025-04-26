import { Inventario } from 'src/inventarios/entities/inventario.entity';
import { ItemVenta } from 'src/item-ventas/entities/item-venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 255 })
  descripcion: string;

  @Column('varchar', { length: 100 })
  presentacion: string;

  @Column('varchar', { length: 100 })
  concentracion: string;

  @Column({ name: 'precio_venta', type: 'decimal', precision: 10, scale: 2 })
  precioVenta: number;

  @Column({ name: 'precio_compra', type: 'decimal', precision: 10, scale: 2 })
  precioCompra: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Inventario, inventarios => inventarios.producto)
  inventarios: Inventario[];

  @OneToMany(() => ItemVenta, itemVentas => itemVentas.producto)
  itemsVentas: ItemVenta[];
}
