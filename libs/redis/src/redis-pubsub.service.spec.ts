import { RedisPubSubService } from './redis-pubsub.service';
import { RedisChannel } from '@app/common';

describe('RedisPubSubService', () => {
  let publisher: { publish: jest.Mock };
  let subscriber: {
    subscribe: jest.Mock;
    unsubscribe: jest.Mock;
    on: jest.Mock;
    off: jest.Mock;
  };
  let service: RedisPubSubService;

  beforeEach(() => {
    publisher = { publish: jest.fn().mockResolvedValue(1) };
    subscriber = {
      subscribe: jest.fn().mockResolvedValue(undefined),
      unsubscribe: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      off: jest.fn(),
    };
    service = new RedisPubSubService(publisher as any, subscriber as any);
  });

  it('publishes JSON-serialized payloads on the given channel', async () => {
    await service.publish(RedisChannel.TWITCH_TOKEN_UPDATED, { foo: 1 });
    expect(publisher.publish).toHaveBeenCalledWith(
      RedisChannel.TWITCH_TOKEN_UPDATED,
      JSON.stringify({ foo: 1 }),
    );
  });

  it('subscribes and dispatches parsed messages, returns an unsubscribe', async () => {
    const handler = jest.fn();
    const unsubscribe = await service.subscribe(
      RedisChannel.TWITCH_TOKEN_UPDATED,
      handler,
    );
    expect(subscriber.subscribe).toHaveBeenCalledWith(
      RedisChannel.TWITCH_TOKEN_UPDATED,
    );
    const onCall = subscriber.on.mock.calls.find(
      ([event]) => event === 'message',
    );
    expect(onCall).toBeDefined();
    const dispatch = onCall![1] as (ch: string, msg: string) => void;
    dispatch(RedisChannel.TWITCH_TOKEN_UPDATED, JSON.stringify({ x: 2 }));
    expect(handler).toHaveBeenCalledWith({ x: 2 });

    await unsubscribe();
    expect(subscriber.off).toHaveBeenCalled();
  });
});
