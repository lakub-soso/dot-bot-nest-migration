import { Command } from './command.base';
import { TwitchContext } from '../value-objects/twitch-context';
import { ChatCommand } from '../value-objects/chat-command';

export class TestCommand extends Command {
  readonly name = 'test';
  readonly aliases = ['test'];

  async execute(
    chatTarget: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    await this.twitchClient.say(twitchContext.room.channel, 'Hello world!');
  }
}
