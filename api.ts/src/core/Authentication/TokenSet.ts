import User from '../User';
import RefreshToken from './RefreshToken';
import AccessToken from './AccessToken';
import { TokenExpiredError } from 'jsonwebtoken';

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

  async verify(): Promise<void> {
    await this.refreshToken.verify();
    try {
      await this.accessToken.verify();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        await this.refreshAccessToken();
      } else {
        throw err;
      }
    }
  }

  async refreshAccessToken(): Promise<void> {
    this.accessToken = await AccessToken.createForUser(await User.findById(this.accessToken.userId()));
  }
}
