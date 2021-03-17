import models from '../db/models';
import _ from 'lodash';
import { IStoryCreate, SprintTransactionAction, PaginationOptions } from './types';
import Project from './Project';

class StoryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StoryError';
  }
}

class StoryNotFoundError extends StoryError {
  constructor(StoryId: number) {
    super(`Story ${StoryId} not found.`);
    this.name = 'StoryNotFoundError';
  }
}

class Story {
  id: number;
  title: string;
  description?: string;
  points: number;
  completedAt?: Date;

  static async findGroupId(StoryId: number): Promise<number> {
    const row = await models.Story.findByPk(StoryId, {attributes: ['ProjectId']});
    if (row === null) throw new StoryNotFoundError(StoryId);
    return await Project.findGroupId(row.ProjectId);
  }

  static async findById(StoryId: number): Promise<null|Story> {
    const dbrow = await models.Story.findByPk(StoryId);
    return dbrow === null ? null : new Story(dbrow.toJSON());
  }

  static async findAllInProject(ProjectId: number, options?: PaginationOptions): Promise<Story[]> {
    const opts = _.assignIn({where: {ProjectId}}, _.pick(options, ['offset', 'limit']));
    const {rows} = await models.Story.findAndCountAll(opts);
    return rows.map(r => new Story(r.toJSON()));
  }

  static async findAllInSprint(SprintId: number): Promise<Story[]> {
    const transactions = await models.SprintTransaction.findAll({
      where: {SprintId},
      include: [models.Story],
      order: [['createdAt', 'ASC']],
    });
    const stories = {};
    for (const transaction of transactions) {
      if (transaction.action === SprintTransactionAction.Claim) _.set(stories, `${transaction.StoryId}`, transaction.Story);
      if (transaction.action === SprintTransactionAction.Remit) _.unset(stories, `${transaction.StoryId}`);
    }
    return _.map(_.values(stories), story => new Story(story.toJSON()));
  }

  static async findAllAvailableForSprint(SprintId: number, options?: PaginationOptions): Promise<Story[]> {
    const {Op} = models.Sequelize;
    const [claimedStories, {ProjectId}] = await Promise.all([
      Story.findAllInSprint(SprintId),
      models.Sprint.findByPk(SprintId, {attributes: ['ProjectId']})
    ]);
    const claimedStoryIds = _.map(claimedStories, 'id');
    const where = {ProjectId, completedAt: null};
    if (_.size(claimedStoryIds)) where['id'] = {[Op.not]: claimedStoryIds};
    const stories = await models.Story.findAll({where});
    return _.map(stories, story => new Story(story.toJSON()));
  }

  static async createInProject(data: IStoryCreate): Promise<Story> {
    const row = await models.Story.create(data);
    return new Story(row.toJSON());
  }

  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.points = data.points;
    this.completedAt = data.completedAt;
  }

  async markComplete(): Promise<void> {
    await models.Story.update({completedAt: new Date()}, {where: {id: this.id}});
  }
}

export default Story;
