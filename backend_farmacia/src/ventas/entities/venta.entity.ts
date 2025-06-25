import { Cliente } from 'src/clientes/entities/cliente.entity';
import { ItemVenta } from 'src/item-ventas/entities/item-venta.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
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

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_Cliente' })
  idCliente: number;

  @Column('integer', { name: 'id_usuario', nullable: true })
  idUsuario: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  efectivo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cambio: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => ItemVenta, itemVentas => itemVentas.venta)
  itemVentas: ItemVenta[];

  @ManyToOne(() => Cliente, cliente => cliente.ventas)
  @JoinColumn({ name: 'id_Cliente', referencedColumnName: 'id' })
  cliente: Cliente;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;
}
