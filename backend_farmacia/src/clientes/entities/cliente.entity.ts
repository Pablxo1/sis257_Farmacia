import { Venta } from 'src/ventas/entities/venta.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 100 })
  apellido: string;

  @Column('varchar', { length: 100 })
  ci: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Venta, ventas => ventas.cliente)
  ventas: Venta[];
}
