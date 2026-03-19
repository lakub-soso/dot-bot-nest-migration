import { Command } from './command.base';
import { TwitchContext } from '../value-objects/twitch-context';
import { ChatCommand } from '../value-objects/chat-command';

export class LurkCommand extends Command {
  readonly name = 'lurk';
  readonly aliases = ['lurk'];

  async execute(command: ChatCommand, context: TwitchContext): Promise<void> {
    await this.twitchClient.say(
      context.room.channel,
      `${context.user.name} is chillin in the pond, thank you for the lurk!`,
    );
  }
}
