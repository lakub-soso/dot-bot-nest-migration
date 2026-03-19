import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { Command } from './command.base';
import { PPResponseRepository } from '../repository/pp-response.repository';
import { PPResponse } from '../entity/pp-response.entity';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';
import {
  PP_RESPONSE_SERVICE,
  PPResponseService,
} from '../services/pp-response.service';
import { IUserService, USER_SERVICE } from '../services/user.service';
import { UserNotFoundTwitchException } from '../exception/user-not-found.twitch-exception';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';

const DEFAULT_RESPONSE = 'I know nothing about your pp';

enum SubCommand {
  ADD = 'add',
}

export class PPCommand extends Command {
  readonly name = 'pp';
  readonly aliases = ['pp', 'benis', 'dingdong'];

  private readonly _ppResponseRepository: PPResponseRepository;
  private readonly _ppResponseService: PPResponseService;
  private readonly _userService: IUserService;

  constructor() {
    super();
    this._ppResponseRepository = new PPResponseRepository();
    this._userService = DependencyProvider.getInstance().get(USER_SERVICE);
    this._ppResponseService =
      DependencyProvider.getInstance().get(PP_RESPONSE_SERVICE);
  }

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    // TODO assign response to a static name?

    if (!chatCommand.hasArguments()) {
      return await this._handleShow(chatCommand, twitchContext);
    }

    if (chatCommand.getArgument(0) === SubCommand.ADD) {
      return await this._handleAdd(chatCommand, twitchContext);
    }

    return await this._handleShow(
      chatCommand,
      twitchContext,
      chatCommand.getArgument(0)!.toLowerCase(),
    );
  }

  async _handleShow(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
    target?: string,
  ): Promise<void> {
    let user;

    if (!target) {
      user = await this._userService.findOrCreate(
        twitchContext.user.id,
        twitchContext.user.name,
      );
    } else {
      user = await this._userService.findByName(target);
      if (!user) {
        throw new UserNotFoundTwitchException(target);
      }
    }

    let response = await this._ppResponseService.findAssigned(user.id);

    if (!response) {
      response = await this._ppResponseService.findRandomVerified();

      if (response) {
        await this._ppResponseService.assign(user.id, response.id);
      }
    }

    await this.twitchClient.say(
      twitchContext.room.channel,
      `@${twitchContext.user.name}, ${response?.content ?? DEFAULT_RESPONSE}`,
    );
  }

  async _handleAdd(
    chatCommant: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    const contentArgs = chatCommant.getArgumentsRange(1);

    if (contentArgs.length === 0) {
      throw new InvalidCommandArgumentException('pp', 'content');
    }

    const response = PPResponse.create(contentArgs.join(' '), false);
    await this._ppResponseRepository.save(response);

    await this.twitchClient.say(
      twitchContext.room.channel,
      `@${twitchContext.user.name}, pp response suggested (awaiting approval)`,
    );
  }
}
