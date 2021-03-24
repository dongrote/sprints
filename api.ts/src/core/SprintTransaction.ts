import { PaginationOptions } from './types';
import _ from 'lodash';
import models from '../db/models';

export enum SprintTransactionAction {
  Claim = 'CLAIM',
  Complete = 'COMPLETE',
  Remit = 'UNCLAIM',
  InProgress = 'INPROGRESS',
}

export interface SprintTransactionCreateDetails {
  SprintId: number;
  StoryId: number;
  action: SprintTransactionAction;
  points: number;
  createdAt?: Date;
}

class SprintTransaction {
  id: number;
  SprintId: number;
  StoryId: number;
  Story;
  action: SprintTransactionAction;
  ts: Date;
  points: number;

  static async create(details: SprintTransactionCreateDetails) {
    const row = await models.SprintTransaction.create(details);
    return new SprintTransaction(row.toJSON());
  }

  static async findAll(options?: PaginationOptions) {
    const {count, rows} = await models.SprintTransaction.findAndCountAll(_.pick(options, ['offset', 'limit']));
    return {count, results: rows.map(r => new SprintTransaction(r.toJSON()))};
  }

  static async findAllInSprint(SprintId: number, options?: PaginationOptions) {
    const opts = _.assignIn({
      where: {SprintId},
      include: [models.Story],
      order: [['createdAt', _.get(options, 'reverse', false) ? 'DESC' : 'ASC']],
    }, _.pick(options, ['offset', 'limit']));
    const {count, rows} = await models.SprintTransaction.findAndCountAll(opts);
    return {count, results: rows.map(r => new SprintTransaction(r.toJSON()))};
  }

  constructor(data) {
    this.id = data.id;
    this.SprintId = data.SprintId;
    this.StoryId = data.StoryId;
    this.Story = data.Story;
    this.action = data.action;
    this.points = data.points;
    this.ts = new Date(data.createdAt);
  }
}

export default SprintTransaction;
