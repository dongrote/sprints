import _ from 'lodash';
import jsonwebtoken from 'jsonwebtoken';
import env from '../../env';
import User from '../User';
import { GroupRole } from '../Group';

export interface AccessTokenPayload {
  userId: number;
  systemRole: string;
  groupRoleBindings: Array<{groupId: number, memberRole: GroupRole}>;
  iat: number;
  exp: number;
}

export class AccessTokenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessTokenError';
  }
}

export class GroupAccessDeniedError extends AccessTokenError {
  UserId: number;
  GroupId: number;
  constructor(UserId, GroupId) {
    super(`User ${UserId} does not have access to Group ${GroupId}.`);
    this.UserId = UserId;
    this.GroupId = GroupId;
  }
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

  belongsToGroupId(GroupId: number): boolean {
    return this.decoded.groupRoleBindings.findIndex(binding => binding.groupId === GroupId) > -1;
  }

  groupRole(GroupId: number): GroupRole {
    const binding = this.decoded.groupRoleBindings.find(groupRoleBinding => groupRoleBinding.groupId === GroupId);
    if (!binding) throw new GroupAccessDeniedError(this.userId(), GroupId);
    return binding.memberRole;
  }

  groupRoleIncludes(GroupId: number, roles: Array<GroupRole>) {
    return _.includes(roles, this.groupRole(GroupId));
  }

  async verify(): Promise<void> {}
}
