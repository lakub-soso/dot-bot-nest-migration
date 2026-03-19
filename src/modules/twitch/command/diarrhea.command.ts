import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { Command } from './command.base';

export class DiarrheaCommand extends Command {
  readonly name = 'diarrhea';
  readonly aliases = ['diarrhea'];

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    await this.twitchClient.say(twitchContext.room.channel, 'shit shit shit');
  }
}
