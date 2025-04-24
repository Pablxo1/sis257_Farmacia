import { Test, TestingModule } from '@nestjs/testing';
import { ItemVentasService } from './item-ventas.service';

describe('ItemVentasService', () => {
  let service: ItemVentasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemVentasService],
    }).compile();

    service = module.get<ItemVentasService>(ItemVentasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
