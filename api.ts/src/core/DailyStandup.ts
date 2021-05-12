import {SprintID} from './Sprint';
import {UserID} from './User';
import {PaginatedResults, PaginationOptions} from './types';
import _ from 'lodash';
import models from '../db/models';

export interface DailyStandupMutableFields {
  whatDidIDoYesterday: string,
  whatAmIDoingToday: string,
  whatIsInMyWay: string,
}

export type DailyStandupCreateArguments = {
  createdBy: UserID,
  SprintId: SprintID,
} & DailyStandupMutableFields;

export type DailyStandupID = number;

export class DailyStandupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DailyStandupError';
  }
}

export class DailyStandupNotFoundError extends DailyStandupError {
  constructor() {
    super(`DailyStandup not found`);
    this.name = 'DailyStandupNotFoundError';
  }
}

export default class DailyStandup {
  DailyStandupId: DailyStandupID;
  whatDidIDoYesterday: string;
  whatAmIDoingToday: string;
  whatIsInMyWay: string;
  SprintId: SprintID;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserID;

  static async create(values: DailyStandupCreateArguments): Promise<DailyStandup> {
    const dbrow = await models.DailyStandup.create({
      createdBy: values.createdBy,
      SprintId: values.SprintId,
      whatDidIDoYesterday: values.whatDidIDoYesterday,
      whatAmIDoingToday: values.whatAmIDoingToday,
      whatIsInMyWay: values.whatIsInMyWay,
    });
    return new DailyStandup({
      id: dbrow.id,
      SprintId: dbrow.SprintId,
      createdBy: dbrow.createdBy,
      createdAt: dbrow.createdAt,
      updatedAt: dbrow.updatedAt,
      whatDidIDoYesterday: dbrow.whatDidIDoYesterday,
      whatAmIDoingToday: dbrow.whatAmIDoingToday,
      whatIsInMyWay: dbrow.whatIsInMyWay,
    });
  }

  static async findAllInSprint(SprintId: SprintID, options?: PaginationOptions): Promise<PaginatedResults<DailyStandup>> {
    const {count, rows} = await models.DailyStandup.findAndCountAll({where: {SprintId}, order: [['createdAt', 'ASC']]});
    return {count, results: rows.map(r => new DailyStandup({
      id: r.id,
      SprintId: r.SprintId,
      createdBy: r.createdBy,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      whatDidIDoYesterday: r.whatDidIDoYesterday,
      whatAmIDoingToday: r.whatAmIDoingToday,
      whatIsInMyWay: r.whatIsInMyWay,
    }))};
  }

  static async findById(DailyStandupId: DailyStandupID): Promise<DailyStandup> {
    const dbRow = await models.DailyStandup.findByPk(DailyStandupId);
    if (dbRow === null) throw new DailyStandupNotFoundError();
    return new DailyStandup({
      id: dbRow.id,
      SprintId: dbRow.SprintId,
      createdBy: dbRow.createdBy,
      createdAt: dbRow.createdAt,
      updatedAt: dbRow.updatedAt,
      whatDidIDoYesterday: dbRow.whatDidIDoYesterday,
      whatAmIDoingToday: dbRow.whatAmIDoingToday,
      whatIsInMyWay: dbRow.whatIsInMyWay,
    });
  }

  constructor(values: DailyStandupCreateArguments & {id: DailyStandupID, createdAt: Date, updatedAt: Date}) {
    this.DailyStandupId = values.id;
    this.SprintId = values.SprintId;
    this.createdBy = values.createdBy;
    this.createdAt = values.createdAt;
    this.updatedAt = values.updatedAt;
    this.whatDidIDoYesterday = values.whatDidIDoYesterday;
    this.whatAmIDoingToday = values.whatAmIDoingToday;
    this.whatIsInMyWay = values.whatIsInMyWay;
  }

  async update(newValues: Partial<DailyStandupMutableFields>): Promise<void> {
    const promises = [];
    if (newValues.whatDidIDoYesterday) {
      promises.push(models.DailyStandup.update({whatDidIDoYesterday: newValues.whatDidIDoYesterday}, {where: {id: this.DailyStandupId}}));
      this.whatDidIDoYesterday = newValues.whatDidIDoYesterday;
    }
    if (newValues.whatAmIDoingToday) {
      promises.push(models.DailyStandup.update({whatAmIDoingToday: newValues.whatAmIDoingToday}, {where: {id: this.DailyStandupId}}));
      this.whatAmIDoingToday = newValues.whatAmIDoingToday;
    }
    if (newValues.whatIsInMyWay) {
      promises.push(models.DailyStandup.update({whatIsInMyWay: newValues.whatIsInMyWay}, {where: {id: this.DailyStandupId}}));
      this.whatIsInMyWay = newValues.whatIsInMyWay;
    }
    await Promise.all(promises);
  }
}
