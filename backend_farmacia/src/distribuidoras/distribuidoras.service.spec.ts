import { Test, TestingModule } from '@nestjs/testing';
import { DistribuidorasService } from './distribuidoras.service';

describe('DistribuidorasService', () => {
  let service: DistribuidorasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistribuidorasService],
    }).compile();

    service = module.get<DistribuidorasService>(DistribuidorasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
