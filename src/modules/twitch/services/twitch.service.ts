import { ChatUserstate } from 'tmi.js';
import { TwitchException } from '../exception/twitch.exception';
import { TwitchClient } from '../types/twitch-client';
import { UnableToConnectException } from '../exception/unable-to-connect.exception';
import { TwitchEvent } from '../enum/twitch-event.enum';
import {
  COMMAND_PROVIDER,
  ICommandProvider,
} from '../provider/command.provider';
import { ChatMessage } from '../value-objects/chat-message';
import { TwitchContext } from '../value-objects/twitch-context';
import { DependencyProvider } from '../../../core/dependency/dependency-provider';
import { isChattable } from '../interfaces/chattable.interface';
import config from '../../../config/config';
import { TwitchClientFactory } from '../factory/twitch-client.factory';
import open from 'open';

export const TWITCH_SERVICE = 'twitch-service';

export interface ITwitchService {
  initialize(): Promise<boolean>;

  getClient(): TwitchClient;
}

export class TwitchService implements ITwitchService {
  private _twitchClient: TwitchClient;
  private readonly commandProvider: ICommandProvider;

  constructor() {
    const dependencyProvider = DependencyProvider.getInstance();

    this.commandProvider = dependencyProvider.get(COMMAND_PROVIDER);
  }

  getClient(): TwitchClient {
    return this._twitchClient;
  }

  async initialize(): Promise<boolean> {
    return (await Promise.all([this.initializeTwitchClient()])).every(
      (result) => result,
    );
  }

  private async handleChatMessageEvent(
    message: string,
    channel: string,
    userstate: ChatUserstate,
    isSelf: boolean,
  ): Promise<void> {
    if (isSelf) {
      return;
    }

    const chatMessage = ChatMessage.create(message);
    const twitchContext = TwitchContext.create(channel, userstate);

    try {
      if (chatMessage.isCommand) {
        const chatCommand = chatMessage.toChatCommand();
        const command = this.commandProvider.getBy(chatCommand.command);

        await command.execute(chatCommand, twitchContext);
      }
    } catch (exception: unknown) {
      if (exception instanceof Object && isChattable(exception)) {
        await this._twitchClient.say(
          twitchContext.room.channel,
          exception.chatMessage,
        );
      }

      if (exception instanceof TwitchException) {
        this.catchException(exception);
      } else {
        console.error(exception);
        throw exception;
      }
    }
  }

  private async handleDisconnect(
    reason: string
  ): Promise<void> {
    console.warn(`Disconnected from Twitch - '${reason}', reconnecting...`);
  }

  private async initializeTwitchClient(): Promise<boolean> {
    try {
      this._twitchClient = TwitchClientFactory.get(config);

      const clientId = 'g5oaqi1qanq6jy98oklswt68piloix';
      const redirectUri = 'http://localhost:5000';
      const scopes = ['channel:bot'].join(' ');

      await open(`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`);

      await this._twitchClient.connect();

      this._twitchClient.on(
        TwitchEvent.CHAT_MESSAGE,
        (
          /* eslint-disable */
          channel: string,
          userstate: ChatUserstate,
          message: string,
          self: boolean,
          /* eslint-enable */
        ) => this.handleChatMessageEvent(message, channel, userstate, self),
      );
    } catch (error: unknown) {
      if (typeof error === 'string') {
        this.catchException(new UnableToConnectException(error));

        return false;
      } else {
        throw error;
      }
    }
    return true;
  }

  private catchException(exception: TwitchException): void {
    console.error(exception);
  }
}
