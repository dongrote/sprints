import { ClaimStoryOptions, CompleteStoryOptions, ISprint, ISprintCreate, ISprintPoints, PaginationOptions, RemitStoryOptions, SprintTransactionAction } from './types';
import SprintTransaction from './SprintTransaction';
import Story from './Story';
import _ from 'lodash';
import models from '../db/models';
import dayjs from 'dayjs';

export default class Sprint implements ISprint {
  id: number;
  ProjectId: number;
  name: string;
  description?: string;
  points: ISprintPoints;
  startAt: Date;
  endAt: Date;

  static async findAll(options?: PaginationOptions): Promise<{count: number, results: Sprint[]}> {
    const {count, rows} = await models.Sprint.findAndCountAll(_.pick(options, ['offset', 'limit']));
    return {count, results: rows.map(r => new Sprint(r.toJSON()))};
  }

  static async findAllInProject(ProjectId: number, options?: PaginationOptions): Promise<{count: number, results: Sprint[]}> {
    const {count, rows} = await models.Sprint.findAndCountAll(_.assignIn({where: {ProjectId}}, _.pick(options, ['offset', 'limit'])));
    return {count, results: rows.map(r => new Sprint(r.toJSON()))};
  }

  static async findById(SprintId: number): Promise<null|Sprint> {
    const row = await models.Sprint.findByPk(SprintId);
    return row === null ? null : new Sprint(row.toJSON());
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

  toJSON() {
    return {
      id: this.id,
      ProjectId: this.ProjectId,
      name: this.name,
      description: this.description,
      points: this.points,
      startAt: this.startAt.toJSON(),
      endAt: this.endAt.toJSON(),
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
    return _.reduce(await SprintTransaction.findAllInSprint(this.id), (acc, transaction): number => {
      if (transaction.action === SprintTransactionAction.Claim) return acc + transaction.points;
      if (transaction.action === SprintTransactionAction.Remit) return acc - transaction.points;
      return acc;
    }, 0);
  }

  velocity(): number {
    return this.points.completed;
  }

  async findAllStories(options?: PaginationOptions): Promise<{count: number, results: Story[]}> {
    return {count: 0, results: []};
  }

  async findAllAvailableStories(options?: PaginationOptions): Promise<{count: number, results: Story[]}> {
    return {count: 0, results: []};
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
