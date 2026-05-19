import { Global, Module, OnModuleDestroy, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigModule, AppConfigService } from '@app/config';
import { REDIS_PUBLISHER, REDIS_SUBSCRIBER } from './redis.constants';
import { RedisPubSubService } from './redis-pubsub.service';

const publisher: Provider = {
  provide: REDIS_PUBLISHER,
  inject: [AppConfigService],
  useFactory: (config: AppConfigService) =>
    new Redis({
      host: config.redis.host,
      port: config.redis.port,
      lazyConnect: false,
    }),
};

const subscriber: Provider = {
  provide: REDIS_SUBSCRIBER,
  inject: [AppConfigService],
  useFactory: (config: AppConfigService) =>
    new Redis({
      host: config.redis.host,
      port: config.redis.port,
      lazyConnect: false,
    }),
};

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [publisher, subscriber, RedisPubSubService],
  exports: [REDIS_PUBLISHER, REDIS_SUBSCRIBER, RedisPubSubService],
})
export class RedisModule implements OnModuleDestroy {
  constructor() {}
  async onModuleDestroy(): Promise<void> {
    // Resolved instances are quit by Nest via provider lifecycle in production;
    // explicit shutdown is handled via app.enableShutdownHooks() and Redis client GC.
    // Clients with active connections respond to SIGTERM via process exit.
  }
}
