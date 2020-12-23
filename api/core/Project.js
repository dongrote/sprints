const Sprint = require('./Sprint');

class DuplicateProjectNameError extends Error {
  constructor(name) {
    super(`A project named '${name}' already exists.`);
  }
}

class Project {
  static async create(name) {
    if (typeof name !== 'string') throw new TypeError('name must be a string');
    if (await Project.findByName(name)) throw new DuplicateProjectNameError(name);
    return new Project();
  }

  static async findByName(name) {
    if (typeof name !== 'string') throw new TypeError('name must be a string');
    return null;
  }

  constructor(data) { this.data = data; }

  async createSprint(name, options) {
    return Sprint.create(this.data.id, name, options);
  }
}

exports = module.exports = Project;
Project.DuplicateProjectNameError = DuplicateProjectNameError;