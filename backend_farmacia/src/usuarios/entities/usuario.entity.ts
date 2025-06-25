import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Venta } from 'src/ventas/entities/venta.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 15 })
  usuario: string;

  @Column('varchar', { length: 250 })
  clave: string;

  @Column('varchar', { length: 50 })
  email: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @OneToMany(() => Venta, ventas => ventas.usuario)
  ventas: Venta[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.clave = await bcrypt.hash(this.clave, salt);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.clave);
  }
}
