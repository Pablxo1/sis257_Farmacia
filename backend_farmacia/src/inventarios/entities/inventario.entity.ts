import { Distribuidora } from 'src/distribuidoras/entities/distribuidora.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventarios')
export class Inventario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_producto' })
  idProducto: number;

  @Column('integer', { name: 'id_distribuidora' })
  idDistribuidora: number;

  @Column('int')
  cantidad: number;

  @Column('date', { name: 'fecha_ingreso_almacen' })
  fechaIngresoAlmacen: Date;

  @Column('date', { name: 'fecha_vencimiento' })
  fechaVencimiento: Date;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Producto, producto => producto.inventarios)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto;

  @ManyToOne(() => Distribuidora, distribuidora => distribuidora.inventarios)
  @JoinColumn({ name: 'id_distribuidora', referencedColumnName: 'id' })
  distribuidora: Distribuidora;

  @OneToMany(() => Inventario, inventario => inventario.id)
  itemVentas: Inventario[];
}
