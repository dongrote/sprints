const _ = require('lodash'),
  models = require('../db/models'),
  {Op} = models.Sequelize;

class UserStory {
  static async status(UserStoryId) {
    const row = await models.UserStory.findByPk(UserStoryId, {
      attributes: ['closingSprintId'],
      include: [models.Sprint],
    });
    if (!row) return;
    if (row.closingSprintId) return 'DONE';
    if (row.Sprints.length) return 'CLAIM';
    return 'READY';
  }

  static async dbrowToJSON(dbrow) {
    const json = dbrow.toJSON ? dbrow.toJSON() : dbrow;
    const status = await UserStory.status(json.id);
    return _.assignIn(json, {status});
  }

  static async create(ProjectId, story, points, options) {
    if (isNaN(ProjectId)) throw new TypeError(`ProjectId must be a number`);
    if (typeof story !== 'string') throw new TypeError(`story must be a string`);
    const values = {ProjectId, title: story, points};
    if (_.has(options, 'description')) values.description = options.description;
    const row = await models.UserStory.create(values);
    return new UserStory(await UserStory.dbrowToJSON(row));
  }

  static async findInSprintById(SprintId, UserStoryId) {
    const row = await models.UserStoryClaims.findOne({where: {SprintId, UserStoryId}, include: [models.UserStory]});
    if (row === null) return null;
    return new UserStory(await UserStory.dbrowToJSON(row.UserStory));
  }

  static async findAllInSprint(SprintId) {
    const {count, rows} = await models.UserStoryClaims.findAndCountAll({
      where: {SprintId},
      include: [models.UserStory],
    });
    return {count, results: await Promise.all(rows.map(async r => new UserStory(_.assignIn(
      await UserStory.dbrowToJSON(r.UserStory), {completedAt: r.completedAt}))))};
  }

  static async findAllInProject(ProjectId) {
    const {count, rows} = await models.UserStory.findAndCountAll({where: {ProjectId}});
    return {count, results: await Promise.all(rows.map(async r => new UserStory(await UserStory.dbrowToJSON(r))))};
  }

  static async findAllReadyInProject(ProjectId) {
    const {count, rows} = await models.UserStory.findAndCountAll({where: {ProjectId, closingSprintId: null}});
    return {count, results: await Promise.all(rows.map(async r => new UserStory(await UserStory.dbrowToJSON(r))))};
  }

  static async findById(UserStoryId) {
    const row = await models.UserStory.findByPk(UserStoryId, {include: [models.Project]});
    return row ? new UserStory(await UserStory.dbrowToJSON(row)) : null;
  }

  constructor(data) { this.data = data; }

  id() { return this.data.id; }
  points() { return this.data.points; }
  completedAt() { return this.data.completedAt; }
  toJSON() { return this.data; }

  async markComplete(SprintId) {
    await Promise.all([
      models.UserStory.update({closingSprintId: SprintId}, {where: {id: this.id()}}),
      models.UserStoryClaims.update({completedAt: new Date()}, {where: {SprintId, UserStoryId: this.id()}})
    ]);
  }

  async update(values) {
    await models.UserStory.update(values, {where: {id: this.id()}});
  }

  async changePointsValue(points) {
    const delta = points - this.points();
    const sprintIds = _.map(await models.UserStoryClaims.findAll({
      where: {UserStoryId: this.id()},
      attributes: ['SprintId'],
    }), row => row.SprintId);
    await models.Sprint.increment('claimedPoints', {by: delta, where: {id: sprintIds}});
    if (this.completedAt()) {
      await models.Sprint.increment('completedPoints', {by: delta, where: {id: this.data.closingSprintId}});
    }
  }
}

exports = module.exports = UserStory;
