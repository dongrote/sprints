import _ from 'lodash';
import jsonwebtoken from 'jsonwebtoken';
import env from '../../env';
import User from '../User';

export interface AccessTokenPayload {
  userId: number;
  systemRole: string;
  groupRoleBindings: Array<{groupId: number, memberRole: string}>;
  iat: number;
  exp: number;
}

export default class AccessToken {
  encoded: string;
  decoded: AccessTokenPayload;

  static async createFromEncoded(encoded: string): Promise<AccessToken> {
    return new AccessToken(encoded, _.pick(jsonwebtoken.decode(encoded), ['userId', 'systemRole', 'groupRoleBindings', 'iat', 'exp']));
  }

  static async createForUser(user: User): Promise<AccessToken> {
    const bindings = await user.groupRoleBindings();
    const encoded = await new Promise((resolve: (value: string) => void, reject) => {
      jsonwebtoken.sign(
        {
          userId: user.id,
          systemRole: user.systemRole,
          groupRoleBindings: bindings.map(binding => ({groupId: binding.GroupId, memberRole: binding.role})),
        },
        env.tokenSigningKey(),
        {expiresIn: env.accessTokenExpiresInSeconds()},
        (err: Error, encoded: string) => err ? reject(err) : resolve(encoded)
      );
    });
    return new AccessToken(encoded, _.pick(jsonwebtoken.decode(encoded), ['userId', 'systemRole', 'groupRoleBindings', 'iat', 'exp']));
  }

  constructor(encoded: string, decoded: AccessTokenPayload) {
    this.encoded = encoded;
    this.decoded = decoded;
  }

  toString(): string { return this.encoded; }

  toJSON(): AccessTokenPayload { return this.decoded; }

  userId(): number { return this.decoded.userId; }

  systemRole(): string { return this.decoded.systemRole; }

  groupIds(): Array<number> { return this.decoded.groupRoleBindings.map(binding => binding.groupId); }

  async verify(): Promise<void> {}
}
