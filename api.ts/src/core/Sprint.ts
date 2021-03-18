import {
  ClaimStoryOptions,
  CompleteStoryOptions,
  ISprint,
  ISprintCreate,
  ISprintPoints,
  PaginatedResults,
  PaginationOptions,
  PaginationOptionsWithGroupId,
  RemitStoryOptions,
  SprintTransactionAction,
} from './types';
import Project from './Project';
import SprintTransaction from './SprintTransaction';
import Story from './Story';
import _ from 'lodash';
import models from '../db/models';
import dayjs from 'dayjs';

export class SprintError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SprintError';
  }
}

export class SprintNotFoundError extends Error {
  constructor(id: number) {
    super(`Sprint ID ${id} not found.`);
    this.name = 'SprintNotFoundError';
  }
}

export default class Sprint implements ISprint {
  id: number;
  ProjectId: number;
  name: string;
  description?: string;
  points: ISprintPoints;
  startAt: Date;
  endAt: Date;

  static async findProjectId(SprintId: number): Promise<number> {
    const row = await models.Sprint.findByPk(SprintId, {attributes: ['ProjectId']});
    if (row === null) throw new SprintNotFoundError(SprintId);
    return row.ProjectId;
  }

  static async findGroupId(SprintId: number): Promise<number> {
    return await Project.findGroupId(await Sprint.findProjectId(SprintId));
  }

  static async findAll(options?: PaginationOptionsWithGroupId): Promise<PaginatedResults<Sprint>> {
    const opts = _.assignIn({order: [['startAt', _.get(options, 'reverse', false) ? 'DESC' : 'ASC']]}, _.pick(options, ['offset', 'limit']));
    const {count, rows} = await models.Sprint.findAndCountAll(opts);
    return {count, results: rows.map(r => new Sprint(r.toJSON()))};
  }

  static async findAllInProject(ProjectId: number, options?: PaginationOptions): Promise<PaginatedResults<Sprint>> {
    const {count, rows} = await models.Sprint
      .findAndCountAll(
        _.assignIn({
          where: {ProjectId},
          order: [['startAt', _.get(options, 'reverse', false) ? 'DESC' : 'ASC']],
        }, _.pick(options, ['offset', 'limit'])));
    return {count, results: rows.map(r => new Sprint(r.toJSON()))};
  }

  static async findById(SprintId: number): Promise<Sprint> {
    const row = await models.Sprint.findByPk(SprintId);
    if (row === null) throw new SprintNotFoundError(SprintId);
    return new Sprint(row.toJSON());
  }

  static async createInProject(ProjectId: number, createOptions: ISprintCreate): Promise<Sprint> {
    const row = await models.Sprint.create(_.assignIn({ProjectId}, _.pick(createOptions, ['name', 'description', 'predictedPoints', 'startAt', 'endAt'])));
    return new Sprint(row.toJSON());
  }

  constructor(data) {
    this.id = data.id;
    this.ProjectId = data.ProjectId;
    this.name = data.name;
    this.description = data.description;
    this.startAt = new Date(data.startAt);
    this.endAt = new Date(data.endAt);
    this.points = {
      predicted: data.predictedPoints,
      completed: data.completedPoints,
      claimed: data.claimedPoints,
      remaining: data.claimedPoints - data.completedPoints,
    };
  }

  async sprintDays(): Promise<Date[]> {
    const startAtDay = dayjs(this.startAt),
      endAtDay = dayjs(this.endAt),
      days = [];
    for (let cursor = startAtDay.startOf('d'); cursor.isBefore(endAtDay, 'd') || cursor.isSame(endAtDay, 'd'); cursor = cursor.add(1, 'd')) {
      days.push(cursor.toDate());
    }
    return days;
  }

  async claimedPoints(): Promise<number> {
    return this.points.claimed;
  }

  velocity(): number {
    return this.points.completed;
  }

  async claimStory(StoryId: number, options?: ClaimStoryOptions): Promise<void> {
    const story = await Story.findById(StoryId);
    await Promise.all([
      SprintTransaction.create({
        SprintId: this.id,
        StoryId: StoryId,
        action: SprintTransactionAction.Claim,
        points: story.points,
        createdAt: _.get(options, 'timestamp', new Date()),
      }),
      models.Sprint.increment('claimedPoints', {where: {id: this.id}, by: story.points}),
    ]);
  }

  async remitStory(StoryId: number, options?: RemitStoryOptions): Promise<void> {
    const story = await Story.findById(StoryId);
    await Promise.all([
      SprintTransaction.create({
        SprintId: this.id,
        StoryId: StoryId,
        action: SprintTransactionAction.Remit,
        points: story.points,
        createdAt: _.get(options, 'timestamp', new Date()),
      }),
      models.Sprint.decrement('claimedPoints', {where: {id: this.id}, by: story.points}),
    ]);
  }

  async completeStory(StoryId: number, options?: CompleteStoryOptions): Promise<void> {
    const story = await Story.findById(StoryId);
    await Promise.all([
      SprintTransaction.create({
        SprintId: this.id,
        StoryId: StoryId,
        action: SprintTransactionAction.Complete,
        points: story.points,
        createdAt: _.get(options, 'timestamp', new Date()),
      }),
      models.Sprint.increment('completedPoints', {where: {id: this.id}, by: story.points}),
      story.markComplete(),
    ]);
  }

}
