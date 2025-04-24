import { Test, TestingModule } from '@nestjs/testing';
import { DistribuidorasController } from './distribuidoras.controller';
import { DistribuidorasService } from './distribuidoras.service';

describe('DistribuidorasController', () => {
  let controller: DistribuidorasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistribuidorasController],
      providers: [DistribuidorasService],
    }).compile();

    controller = module.get<DistribuidorasController>(DistribuidorasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
