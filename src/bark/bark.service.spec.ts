import { Test, TestingModule } from '@nestjs/testing';
import { BarkService } from './bark.service';

describe('BarkService', () => {
  let service: BarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarkService],
    }).compile();

    service = module.get<BarkService>(BarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
