import config from '../../../config/config';
import { TwitchAuthResponseModel } from '../model/twitch-auth-response.model';

export const TWITCH_AUTH_SERVICE = 'twitch-auth-service';

export class TwitchAuthService {
  async generateTokens(authCode: string): Promise<void> {
    const clientId = config.twitch.oauth.clientId;
    const clientSecret = config.twitch.oauth.clientSecret;
    const redirectUri = config.twitch.oauth.redirectUri;
    const grantType = 'authorization_code';

    await new Promise<TwitchAuthResponseModel>((resolve) => {
      fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: authCode,
          grant_type: grantType,
          redirect_uri: redirectUri,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) =>
          response
            .json()
            .then((json) => {
              resolve(json);
            })
            .catch((error) => {
              throw error;
            }),
        )
        .catch((error) => {
          throw error;
        });
    });
  }

  async refreshTokens(): Promise<void> {
    const clientId = config.twitch.oauth.clientId;
    const clientSecret = config.twitch.oauth.clientSecret;
    const grantType = 'refresh_token';
    const refreshToken = '';

    await new Promise<TwitchAuthResponseModel>((resolve) => {
      fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: grantType,
          refresh_token: refreshToken,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) =>
          response
            .json()
            .then((json) => {
              resolve(json);
            })
            .catch((error) => {
              throw error;
            }),
        )
        .catch((error) => {
          throw error;
        });
    });
  }
}
