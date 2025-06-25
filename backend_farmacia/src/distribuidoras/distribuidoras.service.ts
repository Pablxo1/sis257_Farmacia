import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDistribuidoraDto } from './dto/create-distribuidora.dto';
import { UpdateDistribuidoraDto } from './dto/update-distribuidora.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Distribuidora } from './entities/distribuidora.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DistribuidorasService {
  constructor(
    @InjectRepository(Distribuidora) private distribuidorasRepository: Repository<Distribuidora>,
  ) {}

  async create(createDistribuidoraDto: CreateDistribuidoraDto): Promise<Distribuidora> {
    const existe = await this.distribuidorasRepository.findOneBy({
      nombre: createDistribuidoraDto.nombre.trim(),
      telefono: createDistribuidoraDto.telefono.trim(),
      direccion: createDistribuidoraDto.direccion.trim(),
      email: createDistribuidoraDto.email.trim(),
    });

    if (existe) throw new ConflictException('La distribuidora ya existe');

    const distribuidora = new Distribuidora();
    distribuidora.nombre = createDistribuidoraDto.nombre.trim();
    distribuidora.telefono = createDistribuidoraDto.telefono.trim();
    distribuidora.direccion = createDistribuidoraDto.direccion.trim();
    distribuidora.email = createDistribuidoraDto.email.trim();
    return this.distribuidorasRepository.save(distribuidora);
  }

  async findAll() {
    return this.distribuidorasRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Distribuidora> {
    const distribuidora = await this.distribuidorasRepository.findOneBy({ id });
    if (!distribuidora) throw new NotFoundException('La distribuidora no existe');
    return distribuidora;
  }

  async update(id: number, updateDistribuidoraDto: UpdateDistribuidoraDto) {
    const distribuidora = await this.findOne(id);
    const distribuidoraUpdate = Object.assign(distribuidora, updateDistribuidoraDto);
    return this.distribuidorasRepository.save(distribuidoraUpdate);
  }

  async remove(id: number) {
    const inventarios = await this.distribuidorasRepository.manager
      .getRepository('Inventario')
      .count({ where: { idDistribuidora: id } });
    if (inventarios > 0) {
      throw new BadRequestException(
        'No se puede eliminar la distribuidora porque tiene inventarios registrados.',
      );
    }
    return this.distribuidorasRepository.softRemove({ id });
  }
}
