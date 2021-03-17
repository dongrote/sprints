import _ from 'lodash';
import jsonwebtoken from 'jsonwebtoken';
import User from '../User';
import env from '../../env';

export interface RefreshTokenPayload {
  userId: number;
  iat: number;
  exp?: number;
}

export default class RefreshToken {
  encoded: string;
  decoded: RefreshTokenPayload;

  static async createFromEncoded(encoded: string): Promise<RefreshToken> {
    return new RefreshToken(encoded, _.pick(jsonwebtoken.decode(encoded), ['userId', 'iat', 'exp']));
  }

  static async createForUser(user: User): Promise<RefreshToken> {
    const encoded = await new Promise((resolve: (value: string) => void, reject) => {
      jsonwebtoken.sign({userId: user.id}, env.tokenSigningKey(), {expiresIn: env.refreshTokenExpiresInSeconds()}, (err: Error, encoded: string) => err ? reject(err) : resolve(encoded));
    });
    return new RefreshToken(encoded, _.pick(jsonwebtoken.decode(encoded), ['userId', 'iat', 'exp']));
  }

  constructor(encoded: string, decoded: RefreshTokenPayload) {
    this.encoded = encoded;
    this.decoded = decoded;
  }

  toString(): string { return this.encoded; }

  toJSON(): RefreshTokenPayload { return this.decoded; }

  userId(): number { return this.decoded.userId; }

  async verify(): Promise<void> {
    await new Promise((resolve: (value: void) => void, reject) => {
      jsonwebtoken.verify(this.encoded, env.tokenSigningKey(), {algorithms: ['HS256']}, err => err ? reject(err) : resolve());
    });
  }
}
