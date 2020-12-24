const models = require('../db/models'),
  Sprint = require('./Sprint'),
  UserStory = require('./UserStory');

class DuplicateProjectNameError extends Error {
  constructor(name) {
    super(`A project named '${name}' already exists.`);
  }
}

class Project {
  static async create(name) {
    if (typeof name !== 'string') throw new TypeError('name must be a string');
    if (await Project.findByName(name)) throw new DuplicateProjectNameError(name);
    const row = await models.Project.create({name});
    return new Project(row.toJSON());
  }

  static async findById(ProjectId) {
    if (isNaN(ProjectId)) throw new TypeError(`ProjectId must be a number`);
    const row = await models.Project.findByPk(ProjectId);
    return row ? new Project(row.toJSON()) : null;
  }

  static async findByName(name) {
    if (typeof name !== 'string') throw new TypeError('name must be a string');
    const row = await models.Project.findOne({where: {name}});
    return row ? new Project(row.toJSON()) : null;
  }

  static async findAll() {
    const {count, rows} = await models.Project.findAndCountAll();
    return {count, results: rows.map(r => new Project(r.toJSON()))};
  }

  constructor(data) { this.data = data; }

  id() { return this.data.id; }

  toJSON() { return this.data; }

  async createSprint(name, options) {
    return Sprint.create(this.id(), name, options);
  }

  async findAllSprints() {
    return Sprint.findAllInProject(this.id());
  }

  async createUserStory(story, points, options) {
    return UserStory.create(this.id(), story, points, options);
  }

  async findAllUserStories() {
    return UserStory.findAllInProject(this.id());
  }

  async velocity() {
    const {results: sprints} = await this.findAllSprints();
    sprints.reverse();
    return sprints.map(sprint => sprint.velocity());
  }
}

exports = module.exports = Project;
Project.DuplicateProjectNameError = DuplicateProjectNameError;