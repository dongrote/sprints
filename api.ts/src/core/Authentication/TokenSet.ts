import User from '../User';
import RefreshToken from './RefreshToken';
import AccessToken from './AccessToken';

export default class TokenSet {
  refreshToken: RefreshToken;
  accessToken: AccessToken;

  static async createForUser(user: User): Promise<TokenSet> {
    const [refreshToken, accessToken] = await Promise.all([RefreshToken.createForUser(user), AccessToken.createForUser(user)]);
    return new TokenSet(refreshToken, accessToken);
  }

  constructor(refreshToken: RefreshToken, accessToken: AccessToken) {
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
  }

  async refreshAccessToken(): Promise<void> {}
}
