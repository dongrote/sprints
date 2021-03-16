import _ from 'lodash';
import jsonwebtoken from 'jsonwebtoken';
import env from '../../env';
import User from '../User';

export interface AccessTokenPayload {
  userId: number;
  systemRole: string;
  iat: number;
  exp: number;
}

export default class AccessToken {
  encoded: string;
  decoded: AccessTokenPayload;

  static async createFromEncoded(encoded: string): Promise<AccessToken> {
    return new AccessToken(encoded, _.pick(jsonwebtoken.decode(encoded), ['userId', 'systemRole', 'iat', 'exp']));
  }

  static async createForUser(user: User): Promise<AccessToken> {
    const encoded = await new Promise((resolve: (value: string) => void, reject) => {
      jsonwebtoken.sign({userId: user.id, systemRole: user.systemRole}, env.tokenSigningKey(), {expiresIn: env.accessTokenExpiresInSeconds()}, (err: Error, encoded: string) => err ? reject(err) : resolve(encoded));
    });
    return new AccessToken(encoded, _.pick(jsonwebtoken.decode(encoded), ['userId', 'systemRole', 'iat', 'exp']));
  }

  constructor(encoded: string, decoded: AccessTokenPayload) {
    this.encoded = encoded;
    this.decoded = decoded;
  }

  toString(): string { return this.encoded; }

  toJSON(): AccessTokenPayload { return this.decoded; }

  userId(): number { return this.decoded.userId; }

  systemRole(): string { return this.decoded.systemRole; }

  async verify(): Promise<void> {}
}
