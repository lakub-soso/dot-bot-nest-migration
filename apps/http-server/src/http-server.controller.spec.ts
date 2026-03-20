import { Test, TestingModule } from '@nestjs/testing';
import { HttpServerController } from './http-server.controller';
import { HttpServerService } from './http-server.service';

describe('HttpServerController', () => {
  let httpServerController: HttpServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HttpServerController],
      providers: [HttpServerService],
    }).compile();

    httpServerController = app.get<HttpServerController>(HttpServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(httpServerController.getHello()).toBe('Hello World!');
    });
  });
});
