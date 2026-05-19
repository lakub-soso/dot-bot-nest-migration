import { Inject, Injectable, Logger } from '@nestjs/common';
import type Redis from 'ioredis';
import { RedisChannel } from '@app/common';
import { REDIS_PUBLISHER, REDIS_SUBSCRIBER } from './redis.constants';

export type Unsubscribe = () => Promise<void>;
export type MessageHandler<T = unknown> = (payload: T) => void | Promise<void>;

@Injectable()
export class RedisPubSubService {
  private readonly logger = new Logger(RedisPubSubService.name);

  constructor(
    @Inject(REDIS_PUBLISHER) private readonly publisher: Redis,
    @Inject(REDIS_SUBSCRIBER) private readonly subscriber: Redis,
  ) {}

  async publish<T>(channel: RedisChannel, payload: T): Promise<void> {
    await this.publisher.publish(channel, JSON.stringify(payload));
  }

  async subscribe<T>(
    channel: RedisChannel,
    handler: MessageHandler<T>,
  ): Promise<Unsubscribe> {
    await this.subscriber.subscribe(channel);
    const listener = (incomingChannel: string, raw: string): void => {
      if (incomingChannel !== channel) return;
      try {
        handler(JSON.parse(raw) as T);
      } catch (error) {
        this.logger.error(
          `Failed to dispatch message on ${channel}: ${(error as Error).message}`,
        );
      }
    };
    this.subscriber.on('message', listener);
    return async () => {
      this.subscriber.off('message', listener);
      await this.subscriber.unsubscribe(channel);
    };
  }
}
