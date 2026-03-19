import { ChatCommand } from '../value-objects/chat-command';
import { TwitchContext } from '../value-objects/twitch-context';
import { TwitchClient } from '../types/twitch-client';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';
import { TWITCH_SERVICE, TwitchService } from '../services/twitch.service';

export abstract class Command {
  abstract readonly name: string;
  abstract readonly aliases: string[];

  private readonly twitchService: TwitchService;

  protected get twitchClient(): TwitchClient {
    return this.twitchService.getClient();
  }

  constructor() {
    this.twitchService = DependencyProvider.getInstance().get(TWITCH_SERVICE);
  }

  abstract execute(
    chatCommand: ChatCommand,
    twitchContext: TwitchContext,
  ): Promise<void>;
}
