import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppConfigService } from './app-config.service';
import { validateEnv } from './env.validation';

describe('AppConfigService', () =>
{
    const baseEnv = {
        NODE_ENV: 'test',
        HTTP_PORT: '3000',
        DB_HOST: 'localhost',
        DB_PORT: '5432',
        DB_USER: 'u',
        DB_PASSWORD: 'p',
        DB_NAME: 'n',
        REDIS_HOST: 'localhost',
        REDIS_PORT: '6379',
        TWITCH_USERNAME: 'bot',
        TWITCH_CHANNELS: 'a,b',
        TWITCH_OAUTH_CLIENT_ID: 'cid',
        TWITCH_OAUTH_CLIENT_SECRET: 'cs',
        TWITCH_OAUTH_REDIRECT_URI: 'http://localhost:3000/cb',
        TWITCH_COMMAND_PREFIX: '!',
    };

    const ENV_KEYS = Object.keys(baseEnv);
    let savedEnv: Record<string, string | undefined>;

    beforeEach(() =>
    {
        savedEnv = {};
        for (const key of ENV_KEYS)
        {
            savedEnv[ key ] = process.env[ key ];
        }
    });

    afterEach(() =>
    {
        for (const key of ENV_KEYS)
        {
            const original = savedEnv[ key ];
            if (original === undefined)
            {
                delete process.env[ key ];
            } else
            {
                process.env[ key ] = original;
            }
        }
    });

    const build = async (env: Record<string, string>) =>
    {
        for (const key of ENV_KEYS)
        {
            delete process.env[ key ];
        }
        for (const [ key, value ] of Object.entries(env))
        {
            process.env[ key ] = value;
        }
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    ignoreEnvFile: true,
                    validate: validateEnv,
                }),
            ],
            providers: [ AppConfigService ],
        }).compile();
        return module.get(AppConfigService);
    };

    it('exposes typed accessors for all sections', async () =>
    {
        const svc = await build(baseEnv);
        expect(svc.httpPort).toBe(3000);
        expect(svc.database).toEqual({
            host: 'localhost', port: 5432, user: 'u', password: 'p', name: 'n',
        });
        expect(svc.redis).toEqual({ host: 'localhost', port: 6379 });
        expect(svc.twitch.channels).toEqual([ 'a', 'b' ]);
        expect(svc.twitch.commandPrefix).toBe('!');
    });

    it('throws when a required env var is missing', async () =>
    {
        const env = { ...baseEnv } as Record<string, string>;
        delete env.DB_HOST;
        await expect(build(env)).rejects.toThrow(/DB_HOST/);
    });
});
