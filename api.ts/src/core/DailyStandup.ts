import {SprintID} from './Sprint';
import {UserID} from './User';
import {PaginatedResults, PaginationOptions} from './types';
import models from '../db/models';

export interface DailyStandupCreateArguments {
  createdBy: UserID,
  SprintId: SprintID,
  whatDidIDoYesterday: string,
  whatAmIDoingToday: string,
  whatIsInMyWay: string,
}

export type DailyStandupID = number;

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
}
