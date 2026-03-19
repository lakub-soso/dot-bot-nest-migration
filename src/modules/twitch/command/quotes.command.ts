import { Command } from './command.base';
import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { QuoteRepository } from '../repository/quote.repository';

export class QuotesCommand extends Command {
  readonly name = 'quotes';
  readonly aliases = ['quotes', 'quote'];

  private readonly _quoteRepository: QuoteRepository;

  constructor() {
    super();
    this._quoteRepository = new QuoteRepository();
  }

  async execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void> {
    const quotesCount = await this._quoteRepository.count();

    await this.twitchClient.say(
      twitchContext.room.channel,
      `There are currently ${quotesCount} quotes saved.`,
    );
  }
}
