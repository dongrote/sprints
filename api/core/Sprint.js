const _ = require('lodash'),
  models = require('../db/models'),
  UserStory = require('./UserStory');

class Sprint {
  static async create(ProjectId, name, options) {
    if (isNaN(ProjectId)) throw new TypeError(`ProjectId must be a number`);
    if (typeof name !== 'string') throw new TypeError(`name must be a string`);
    const values = {ProjectId, title: name};
    if (_.has(options, 'start')) values.startAt = options.start;
    if (_.has(options, 'finish')) values.finishAt = options.finish;
    if (_.has(options, 'points')) values.predictedPoints = options.points;
    if (_.has(options, 'description')) values.description = options.description;
    const row = await models.Sprint.create(values);
    return new Sprint(row.toJSON());
  }

  static async findAllInProject(ProjectId) {
    const {count, rows} = await models.Sprint.findAndCountAll({where: {ProjectId}});
    return {count, results: rows.map(r => new Sprint(r.toJSON()))};
  }

  constructor(data) { this.data = data; }

  id() { return this.data.id; }

  toJSON() { return this.data; }

  velocity() { return this.data.completedPoints; }

  async findUserStoryById(UserStoryId) {
    return UserStory.findInSprintById(this.id(), UserStoryId);
  }

  async completeUserStory(UserStoryId) {
    const story = await this.findUserStoryById(UserStoryId);
    if (story) {
      await story.markComplete(this.id());
      await models.Sprint.increment('completedPoints', {where: {id: this.id()}, by: story.points()});
    }
  }

  async claimUserStory(UserStoryId) {
    if (await this.findUserStoryById(UserStoryId)) return;
    await models.UserStoryClaims.create({SprintId: this.id(), UserStoryId});
    const story = await this.findUserStoryById(UserStoryId);
    await models.Sprint.increment('claimedPoints', {where: {id: this.id()}, by: story.points()});
  }
}

exports = module.exports = Sprint;