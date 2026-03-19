import { ConfigKey } from './enum/config-key.enum';
import { configDotenv } from 'dotenv';
import { MissingEvConfigException } from './exception/missing-ev.config-exception';

export class Config {
  private static instance: Config;

  static getInstance(): Config {
    return this.instance || (this.instance = new this());
  }

  readonly twitch;
  readonly database;

  private constructor() {
    configDotenv();

    this.twitch = {
      channels: ['dotanek'],
      commands: {
        prefix: '!',
      },
      username: this.getEnvironmental<string>(ConfigKey.TWITCH_USERNAME),
      token: this.getEnvironmental<string>(ConfigKey.TWITCH_TOKEN),
      oauth: {
        clientId: this.getEnvironmental<string>(
          ConfigKey.TWITCH__OAUTH_CLIENT_ID,
        ),
        clientSecret: this.getEnvironmental<string>(
          ConfigKey.TWITCH__OAUTH_CLIENT_SECRET,
        ),
        redirectUri: this.getEnvironmental<string>(
          ConfigKey.TWITCH__OAUTH_REDIRECT_URI,
        ),
      },
    };

    this.database = {
      port: this.getEnvironmental<number>(ConfigKey.DATABASE_PORT),
      host: this.getEnvironmental<string>(ConfigKey.DATABASE_HOST),
      username: this.getEnvironmental<string>(ConfigKey.DATABASE_USER),
      password: this.getEnvironmental<string>(ConfigKey.DATABASE_PASSWORD),
      database: this.getEnvironmental<string>(ConfigKey.DATABASE_NAME),
      synchronize: false,
      logging: false,
    };
  }

  getEnvironmental<T extends string | number>(key: ConfigKey): T {
    const value = process.env[key];

    if (value === undefined) {
      throw new MissingEvConfigException(key);
    }

    return value as T;
  }
}

export default Config.getInstance();
