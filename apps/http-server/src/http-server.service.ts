import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
