import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(@InjectRepository(Cliente) private clientesRepository: Repository<Cliente>) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const existe = await this.clientesRepository.findOneBy({
      nombre: createClienteDto.nombre.trim(),
      apellido: createClienteDto.apellido.trim(),
      ci: createClienteDto.ci.trim(),
    });

    if (existe) throw new ConflictException('El cliente ya existe');

    const cliente = new Cliente();
    cliente.nombre = createClienteDto.nombre.trim();
    cliente.apellido = createClienteDto.apellido.trim();
    cliente.ci = createClienteDto.ci.trim();
    return this.clientesRepository.save(cliente);
  }

  async findAll() {
    return this.clientesRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOneBy({ id });
    if (!cliente) throw new NotFoundException('El cliente no existe');
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    const clienteUpdate = Object.assign(cliente, updateClienteDto);
    return this.clientesRepository.save(clienteUpdate);
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    if (cliente) return this.clientesRepository.softRemove(cliente);
  }
}
