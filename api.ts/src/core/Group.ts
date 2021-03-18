import _ from 'lodash';
import { PaginatedResults } from './types';
import models from '../db/models';

interface SequelizeGroup {
  id: number;
  name: string|null;
  createdAt: Date;
  updatedAt: Date;
}

export class GroupError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GroupError';
  }
}

export class GroupNotFoundError extends GroupError {
  constructor(GroupId: number) {
    super(`Group ${GroupId} not found.`);
    this.name = 'GroupNotFoundError';
  }
}

export interface GroupCreateOptions {
  name: string;
  ownerId: number;
}

export interface GroupFindAllOptions {
  id?: number|Array<number>;
  offset?: number;
  limit?: number;
}

export enum GroupRole {
  OWNER='owner',
  MANAGER='manager',
  DEVELOPER='developer',
}

export interface GroupRoleBinding {
  GroupId: number;
  UserId: number;
  role: GroupRole;
}

export interface GroupMember {
  GroupId: number;
  UserId: number;
  email: string;
  role: GroupRole;
}

export default class Group {
  id: number;
  name: string|null;

  static async create(options: GroupCreateOptions): Promise<Group> {
    const dbRow = await models.Group.create({name: options.name});
    await models.GroupRoleBinding.create({GroupId: dbRow.id, UserId: options.ownerId, role: GroupRole.OWNER});
    return new Group(dbRow.toJSON());
  }

  static async findAll(options?: GroupFindAllOptions): Promise<PaginatedResults<Group>> {
    const where = _.pick(options, 'id');
    const {count, rows} = await models.Group.findAndCountAll({where});
    return {count, results: rows.map(row => new Group(row.toJSON()))};
  }

  static async findById(id: number): Promise<Group> {
    const row = await models.Group.findByPk(id);
    if (row === null) throw new GroupNotFoundError(id);
    return new Group(row.toJSON());
  }

  constructor(dbRow: SequelizeGroup) {
    this.id = dbRow.id;
    this.name = dbRow.name;
  }

  async addUserRole(UserId: number, role: GroupRole): Promise<void> {
    await models.GroupRoleBinding.create({UserId, role, GroupId: this.id});
  }

  async changeUserRole(UserId: number, role: GroupRole): Promise<void> {
    await models.GroupRoleBinding.update({role}, {where: {UserId, GroupId: this.id}});
  }

  async removeUserRole(UserId: number): Promise<void> {
    await models.GroupRoleBinding.destroy({where: {UserId, GroupId: this.id}});
  }

  async findAllMembers(): Promise<Array<GroupMember>> {
    const bindings = await models.GroupRoleBinding.findAll({where: {GroupId: this.id}, include: [models.User]});
    return bindings.map(binding => ({
      GroupId: this.id,
      UserId: binding.UserId,
      email: binding.User.email,
      displayName: binding.User.displayName,
      avatarUrl: binding.User.avatarUrl,
      role: binding.role,
    }));
  }
}
