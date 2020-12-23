const _ = require('lodash'),
  models = require('../db/models');

class UserStory {
  static async create(ProjectId, story, points, options) {
    if (isNaN(ProjectId)) throw new TypeError(`ProjectId must be a number`);
    if (typeof story !== 'string') throw new TypeError(`story must be a string`);
    const values = {ProjectId, title: story, points};
    if (_.has(options, 'description')) values.description = options.description;
    const row = await models.UserStory.create(values);
    return new UserStory(row.toJSON());
  }

  static async findInSprintById(SprintId, UserStoryId) {
    const row = await models.UserStoryClaims.findOne({where: {SprintId, UserStoryId}, include: [models.UserStory]});
    if (row === null) return null;
    return new UserStory(row.toJSON().UserStory);
  }

  static async findAllInProject(ProjectId) {
    const {count, rows} = await models.UserStory.findAndCountAll({where: {ProjectId}});
    return {count, results: rows.map(r => new UserStory(r.toJSON()))};
  }

  constructor(data) { this.data = data; }

  id() { return this.data.id; }
  points() { return this.data.points; }
  toJSON() { return this.data; }

  async markComplete(SprintId) {
    await Promise.all([
      models.UserStory.update({closingSprintId: SprintId}, {where: {id: this.id()}}),
      models.UserStoryClaims.update({completedAt: new Date()}, {where: {SprintId, UserStoryId: this.id()}})
    ]);
  }
}

exports = module.exports = UserStory;