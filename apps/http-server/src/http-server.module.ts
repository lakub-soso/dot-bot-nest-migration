import { Module } from '@nestjs/common';
import { HttpServerController } from './http-server.controller';
import { HttpServerService } from './http-server.service';

@Module({
  imports: [],
  controllers: [HttpServerController],
  providers: [HttpServerService],
})
export class HttpServerModule {}
