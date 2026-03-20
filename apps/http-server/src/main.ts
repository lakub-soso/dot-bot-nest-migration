import { NestFactory } from '@nestjs/core';
import { HttpServerModule } from './http-server.module';

async function bootstrap() {
  const app = await NestFactory.create(HttpServerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
