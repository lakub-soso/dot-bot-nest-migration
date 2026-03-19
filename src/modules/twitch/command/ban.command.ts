import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { Command } from './command.base';

export class BanCommand extends Command {
  readonly name = 'ban';
  readonly aliases = ['ban'];

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    let target = chatCommand.getArgument(0);

    if (!target) {
      target = twitchContext.user.name;
    }

    await this.twitchClient.say(
      twitchContext.room.channel,
      `${target} is now banned`,
    );
  }
}
