const _ = require('lodash'),
  day = require('dayjs'),
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
    const {count, rows} = await models.Sprint.findAndCountAll({where: {ProjectId}, order: [['id', 'DESC']]});
    return {count, results: rows.map(r => new Sprint(r.toJSON()))};
  }

  static async findById(SprintId) {
    const row = await models.Sprint.findByPk(SprintId, {include: [models.Project]});
    return row ? new Sprint(row.toJSON()) : null;
  }

  constructor(data) { this.data = data; }

  id() { return this.data.id; }

  claimedPoints() { return this.data.claimedPoints; }

  toJSON() { return this.data; }

  velocity() { return this.data.completedPoints; }

  idealBurndownValues() {
    const startAt = day(this.data.startAt).startOf('d'),
      finishAt = day(this.data.finishAt).startOf('d'),
      claimedPoints = this.claimedPoints(),
      dayCount = finishAt.diff(startAt, 'd');
    return [[0, claimedPoints], [dayCount - 1, 0]];
  }

  async realBurndownValues() {
    const startAt = day(this.data.startAt),
      finishAt = day(this.data.finishAt),
      claimedPoints = this.claimedPoints();
    const numberOfDays = finishAt.diff(startAt, 'd');
    const {results: claimedStories} = await this.findAllUserStories();
    const dates = _.range(numberOfDays).map(i => startAt.add(i, 'd'));
    const remainingPoints = dates.map(date => {
      const candidateStories = _.filter(claimedStories, story => {
        const completedAt = story.completedAt();
        if (!completedAt) return false;
        const completedAtDay = day(completedAt);
        return completedAtDay.isSame(date, 'day') || completedAtDay.isBefore(date, 'day');
      });
      return claimedPoints - candidateStories.reduce((acc, story) => acc + story.points(), 0);
    });
    return remainingPoints;
  }

  async burndown() {
    return {ideal: this.idealBurndownValues(), remaining: await this.realBurndownValues()};
  }

  async findUserStoryById(UserStoryId) {
    return UserStory.findInSprintById(this.id(), UserStoryId);
  }

  async findAllUserStories() {
    return UserStory.findAllInSprint(this.id());
  }

  async findAllAvailableStories() {
    const [allReadyUserStories, claimedUserStories] = await Promise.all([
      UserStory.findAllReadyInProject(this.data.ProjectId),
      this.findAllUserStories(),
    ]);
    const available = _.differenceWith(allReadyUserStories.results, claimedUserStories.results, (all, claimed) => all.id() === claimed.id());
    return {count: available.length, results: available};
  }

  async completeUserStory(UserStoryId) {
    const story = await this.findUserStoryById(UserStoryId);
    if (story) {
      await Promise.all([
        story.markComplete(this.id()), 
        models.Sprint.increment('completedPoints', {where: {id: this.id()}, by: story.points()}),
      ]);
    }
  }

  async claimUserStory(UserStoryId) {
    if (await this.findUserStoryById(UserStoryId)) return;
    await models.UserStoryClaims.create({SprintId: this.id(), UserStoryId});
    const story = await this.findUserStoryById(UserStoryId);
    await models.Sprint.increment('claimedPoints', {where: {id: this.id()}, by: story.points()});
  }

  async remitUserStory(UserStoryId) {
    const story = await this.findUserStoryById(UserStoryId);
    if (story === null) return;
    await models.Sprint.decrement('claimedPoints', {where: {id: this.id()}, by: story.points()});
    await models.UserStoryClaims.destroy({where: {SprintId: this.id(), UserStoryId}});
  }

  async update(values) {
    await models.Sprint.update(values, {where: {id: this.id()}});
  }
}

exports = module.exports = Sprint;