import { IInitializable } from '../../../core/common/interface/initializable.interface';
import express, { Request } from 'express';
import {
  TWITCH_AUTH_SERVICE,
  TwitchAuthService,
} from '../services/twitch-auth.service';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';

export const TWITCH_CONTROLLER = 'twitch-controller';

export class TwitchController implements IInitializable {
  private readonly twitchAuthService: TwitchAuthService =
    DependencyProvider.getInstance().get(TWITCH_AUTH_SERVICE);

  async initialize(): Promise<boolean> {
    const app = express();
    const port = 5000;

    app.get('/', async (req: Request, res) => {
      const authCode = req.query.code;

      if (!authCode || typeof authCode !== 'string') {
        return res.status(400).send('Missing authentication code.');
      }
      await this.twitchAuthService.generateTokens(authCode);
      res.send('Successfully authenticated, you can now close this page.');
    });

    app.listen(port, () => {});

    return true;
  }
}
