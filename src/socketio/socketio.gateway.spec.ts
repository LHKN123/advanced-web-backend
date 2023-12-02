import { Test, TestingModule } from '@nestjs/testing';
import { SocketioGateway } from './socketio.gateway';

describe('SocketioGateway', () => {
  let gateway: SocketioGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketioGateway],
    }).compile();

    gateway = module.get<SocketioGateway>(SocketioGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
