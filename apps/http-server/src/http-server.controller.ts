import { Controller, Get } from '@nestjs/common';
import { HttpServerService } from './http-server.service';

@Controller()
export class HttpServerController {
  constructor(private readonly httpServerService: HttpServerService) {}

  @Get()
  getHello(): string {
    return this.httpServerService.getHello();
  }
}
