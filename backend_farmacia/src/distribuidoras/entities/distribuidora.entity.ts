import { Inventario } from 'src/inventarios/entities/inventario.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('distribuidoras')
export class Distribuidora {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column('varchar', { length: 100 })
  telefono: string;

  @Column('varchar', { length: 255 })
  direccion: string;

  @Column('varchar', { length: 100 })
  email: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => Inventario, inventarios => inventarios.distribuidora)
  inventarios: Inventario[];
}
