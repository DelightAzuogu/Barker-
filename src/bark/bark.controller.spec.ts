import { Test, TestingModule } from '@nestjs/testing';
import { BarkController } from './bark.controller';

describe('BarkController', () => {
  let controller: BarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarkController],
    }).compile();

    controller = module.get<BarkController>(BarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
