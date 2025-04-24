import { Injectable } from '@nestjs/common';
import { CreateDistribuidoraDto } from './dto/create-distribuidora.dto';
import { UpdateDistribuidoraDto } from './dto/update-distribuidora.dto';

@Injectable()
export class DistribuidorasService {
  create(createDistribuidoraDto: CreateDistribuidoraDto) {
    return 'This action adds a new distribuidora';
  }

  findAll() {
    return `This action returns all distribuidoras`;
  }

  findOne(id: number) {
    return `This action returns a #${id} distribuidora`;
  }

  update(id: number, updateDistribuidoraDto: UpdateDistribuidoraDto) {
    return `This action updates a #${id} distribuidora`;
  }

  remove(id: number) {
    return `This action removes a #${id} distribuidora`;
  }
}
