import { Module } from '@nestjs/common';
import { DistribuidorasService } from './distribuidoras.service';
import { DistribuidorasController } from './distribuidoras.controller';

@Module({
  controllers: [DistribuidorasController],
  providers: [DistribuidorasService],
})
export class DistribuidorasModule {}
