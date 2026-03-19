import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { Command } from './command.base';
import { InvalidCommandArgumentException } from '../exception/invalid-command-argument.exception';
import { LoveAssignmentRepository } from '../repository/love-assignment.repository';
import { LoveAssignment } from '../entity/love.entity';

export class LoveCommand extends Command {
  readonly name = 'love';
  readonly aliases = ['love'];

  private readonly _loveAssignmentRepository = new LoveAssignmentRepository();

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    if (!chatCommand.hasArguments()) {
      throw new InvalidCommandArgumentException(this.name, 'target');
    }

    const userName = twitchContext.user.name.toLowerCase();
    const targetArg = chatCommand.getArgumentsRange(0).join(' ').toLowerCase();

    let assignment = await this._loveAssignmentRepository.findOneBy(
      userName,
      targetArg,
    );

    if (!assignment) {
      assignment = LoveAssignment.create(userName, targetArg);
    }

    if (assignment.isExpired()) {
      assignment.refresh();
    }

    await this._loveAssignmentRepository.save(assignment);

    await this.twitchClient.say(
      twitchContext.room.channel,
      `@${twitchContext.user.name}, there is ${assignment.value}% love dotane1Heart between you and ${targetArg}!`,
    );
  }
}
