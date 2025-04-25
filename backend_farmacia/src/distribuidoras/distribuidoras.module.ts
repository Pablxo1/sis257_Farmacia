import { Module } from '@nestjs/common';
import { DistribuidorasService } from './distribuidoras.service';
import { DistribuidorasController } from './distribuidoras.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Distribuidora } from './entities/distribuidora.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Distribuidora])],
  controllers: [DistribuidorasController],
  providers: [DistribuidorasService],
})
export class DistribuidorasModule {}
