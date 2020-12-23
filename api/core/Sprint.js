class Sprint {
  static async create(ProjectId, name) {
    if (isNaN(ProjectId)) throw new TypeError(`ProjectId must be a number`);
    if (typeof name !== 'string') throw new TypeError(`name must be a string`);
    return new Sprint();
  }
}

exports = module.exports = Sprint;