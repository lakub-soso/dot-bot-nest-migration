import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDatabaseConfig, IRedisConfig, ITwitchConfig } from '../../common/src';

@Injectable()
export class AppConfigService
{
    constructor(private readonly config: ConfigService) { }

    get nodeEnv(): string
    {
        return this.config.getOrThrow<string>('NODE_ENV');
    }

    get httpPort(): number
    {
        return this.config.getOrThrow<number>('HTTP_PORT');
    }

    get database(): IDatabaseConfig
    {
        return {
            host: this.config.getOrThrow<string>('DB_HOST'),
            port: this.config.getOrThrow<number>('DB_PORT'),
            user: this.config.getOrThrow<string>('DB_USER'),
            password: this.config.getOrThrow<string>('DB_PASSWORD'),
            name: this.config.getOrThrow<string>('DB_NAME'),
        };
    }

    get redis(): IRedisConfig
    {
        return {
            host: this.config.getOrThrow<string>('REDIS_HOST'),
            port: this.config.getOrThrow<number>('REDIS_PORT'),
        };
    }

    get twitch(): ITwitchConfig
    {
        const channelsRaw = this.config.get<string>('TWITCH_CHANNELS') ?? '';
        return {
            username: this.config.get<string>('TWITCH_USERNAME') ?? '',
            channels: channelsRaw.split(',').map((c) => c.trim()).filter(Boolean),
            oauthClientId: this.config.get<string>('TWITCH_OAUTH_CLIENT_ID') ?? '',
            oauthClientSecret: this.config.get<string>('TWITCH_OAUTH_CLIENT_SECRET') ?? '',
            oauthRedirectUri: this.config.get<string>('TWITCH_OAUTH_REDIRECT_URI') ?? '',
            commandPrefix: this.config.getOrThrow<string>('TWITCH_COMMAND_PREFIX'),
        };
    }
}
