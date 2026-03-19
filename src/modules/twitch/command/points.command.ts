import { Command } from './command.base';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { UserRepository } from '../repository/user.repository';
import { USER_SERVICE, UserService } from '../services/user.service';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';
import { UserNotFoundTwitchException } from '../exception/user-not-found.twitch-exception';
import { IsNumberValidator } from '../../../core/common/validator/is-number.validator';
import { User } from '../entity/user.entity';

enum SubCommand {
  Set = 'set',
  Add = 'add',
  Remove = 'remove',
}

export class PointsCommand extends Command {
  readonly name = 'points';
  readonly aliases = ['points'];

  private readonly _userService: UserService;
  private readonly _userRepository: UserRepository;

  constructor() {
    super();
    const dependencyProvider = DependencyProvider.getInstance();

    this._userService = dependencyProvider.get(USER_SERVICE);
    this._userRepository = new UserRepository();
  }

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    if (!chatCommand.hasArguments()) {
      return this._handleNoArg(twitchContext);
    }

    const argOne = chatCommand.getArgument(0);

    if (chatCommand.getArgument(0) === SubCommand.Set) {
      return await this._handleSet(chatCommand, twitchContext);
    }

    if (argOne === SubCommand.Add) {
      return await this._handleAdd(chatCommand, twitchContext);
    }

    if (argOne === SubCommand.Remove) {
      return await this._handleRemove(chatCommand, twitchContext);
    }

    await this._handleSet(chatCommand, twitchContext);
  }

  private async _handleNoArg(twitchContext: TwitchContext): Promise<void> {
    const user = await this._userService.findOrCreate(
      twitchContext.user.id,
      twitchContext.user.name,
    );

    await this.twitchClient.say(
      twitchContext.room.channel,
      `@${twitchContext.user.name}, you have ${user.wealth.value} points.`,
    );
  }

  private async _handleSet(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    if (!twitchContext.user.mod) {
      return;
    }

    const user = await this._findUser(chatCommand.getArgument(1));

    const pointsArg = chatCommand.getArgument(2);

    this._validatePointsArg(pointsArg);

    if (!pointsArg) {
      throw new InvalidCommandArgumentException(this.name, 'points');
    }

    user.setWealth(+pointsArg);

    await this._userRepository.save(user);

    await this.twitchClient.say(
      twitchContext.room.channel,
      `Set ${user.name} points to ${pointsArg}`,
    );
  }

  private async _handleAdd(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    if (!twitchContext.user.mod) {
      return;
    }

    const user = await this._findUser(chatCommand.getArgument(1));

    const pointsArg = chatCommand.getArgument(2);

    this._validatePointsArg(pointsArg);

    if (!pointsArg) {
      throw new InvalidCommandArgumentException(this.name, 'points');
    }

    user.increaseWealth(+pointsArg);

    await this._userRepository.save(user);

    await this.twitchClient.say(
      twitchContext.room.channel,
      `Increased ${user.name} points to ${user.getWealth()}`,
    );
  }

  private async _handleRemove(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    if (!twitchContext.user.mod) {
      return;
    }

    const user = await this._findUser(chatCommand.getArgument(1));

    const pointsArg = chatCommand.getArgument(2);

    this._validatePointsArg(pointsArg);

    if (!pointsArg) {
      throw new InvalidCommandArgumentException(this.name, 'points');
    }

    user.decreaseWealth(+pointsArg);

    await this._userRepository.save(user);

    await this.twitchClient.say(
      twitchContext.room.channel,
      `Reduced ${user.name} points to ${user.getWealth()}`,
    );
  }

  private async _findUser(nameArg: string | null): Promise<User> {
    if (!nameArg) {
      throw new InvalidCommandArgumentException(this.name, 'username');
    }

    const user = await this._userService.findByName(nameArg.toLowerCase());

    if (!user) {
      throw new UserNotFoundTwitchException(nameArg);
    }

    return user;
  }

  private _validatePointsArg(pointsArg: string | null): void {
    if (!pointsArg) {
      throw new InvalidCommandArgumentException(this.name, 'points');
    }

    if (!new IsNumberValidator().check(pointsArg)) {
      throw new InvalidCommandArgumentException(
        this.name,
        pointsArg,
        `not a number`,
      );
    }
  }
}
