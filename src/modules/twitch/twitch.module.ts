import { ModuleName } from '../../application/enum/module-name.enum';
import {
  ITwitchService,
  TWITCH_SERVICE,
  TwitchService,
} from './services/twitch.service';
import { IModule } from '../../core/common/interface/module.interface';
import { DependencyProvider } from '../../core/dependency/dependency-provider';
import { USER_SERVICE, UserService } from './services/user.service';
import { COMMAND_PROVIDER, CommandProvider } from './provider/command.provider';
import {
  PP_RESPONSE_SERVICE,
  PPResponseService,
} from './services/pp-response.service';
import {
  TWITCH_CONTROLLER,
  TwitchController,
} from './controllers/twitch.controller';
import { TWITCH_AUTH_SERVICE, TwitchAuthService } from './services/twitch-auth.service';

export class TwitchModule implements IModule {
  readonly name = ModuleName.TWITCH;

  private readonly service: ITwitchService;

  constructor() {
    const dependencyProvider = DependencyProvider.getInstance();

    dependencyProvider.register([
      {
        key: USER_SERVICE,
        class: UserService,
      },
      {
        key: PP_RESPONSE_SERVICE,
        class: PPResponseService,
      },
      {
        key: COMMAND_PROVIDER,
        class: CommandProvider,
      },
      {
        key: TWITCH_SERVICE,
        class: TwitchService,
      },
      {
        key: TWITCH_AUTH_SERVICE,
        class: TwitchAuthService,
      },
      {
        key: TWITCH_CONTROLLER,
        class: TwitchController,
      },
    ]);

    this.service = dependencyProvider.get(TWITCH_SERVICE);
  }
}
