import { Command } from './command.base';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';

export class StinkyCommand extends Command {
  readonly name = 'stinky';
  readonly aliases = ['stinky'];

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    await this.twitchClient.say(
      twitchContext.room.channel,
      `Oh look, it's Toll - the ultra stinker that stinks`,
    );
  }
}
