import { Command } from './command.base';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';

export class GuguCommand extends Command {
  readonly name = 'gugu';
  readonly aliases = ['gugu'];

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    await this.twitchClient.say(twitchContext.room.channel, 'gaga');
  }
}
