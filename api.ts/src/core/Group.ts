import _ from 'lodash';
import { PaginatedResults } from './types';
import models from '../db/models';

interface SequelizeGroup {
  id: number;
  name: string|null;
  createdAt: Date;
  updatedAt: Date;
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

export interface GroupRoleBinding {
  GroupId: number;
  UserId: number;
  role: string;
}

export default class Group {
  id: number;
  name: string|null;

  static async create(options: GroupCreateOptions): Promise<Group> {
    const dbRow = await models.Group.create({name: options.name});
    await models.GroupRoleBinding.create({GroupId: dbRow.id, UserId: options.ownerId, role: 'owner'});
    return new Group(dbRow.toJSON());
  }

  static async findAll(options?: GroupFindAllOptions): Promise<PaginatedResults<Group>> {
    const where = _.pick(options, 'id');
    const {count, rows} = await models.Group.findAndCountAll({where});
    return {count, results: rows.map(row => new Group(row.toJSON()))};
  }

  constructor(dbRow: SequelizeGroup) {
    this.id = dbRow.id;
    this.name = dbRow.name;
  }
}
