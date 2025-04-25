import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventarios')
export class Inventario {
  @PrimaryGeneratedColumn('identity')
  id: number;

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
}
