import { Test, TestingModule } from '@nestjs/testing';
import { ItemVentasController } from './item-ventas.controller';
import { ItemVentasService } from './item-ventas.service';

describe('ItemVentasController', () => {
  let controller: ItemVentasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemVentasController],
      providers: [ItemVentasService],
    }).compile();

    controller = module.get<ItemVentasController>(ItemVentasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
