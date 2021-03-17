import { IProject, PaginationOptions, PaginatedResults } from './types';
import _ from 'lodash';
import models from '../db/models';
import Sprint from './Sprint';

export class ProjectNameExistsError extends Error {
  constructor(name) {
    super(`Project with name '${name}' already exists.`);
  }
}

export default class Project implements IProject {
  id: number;
  GroupId: number;
  name: string;
  description?: string;

  static async findAll(options?: PaginationOptions & {GroupId?: number}): Promise<PaginatedResults<Project>> {
    const opt = {order: [['name']], offset: _.get(options, 'offset', 0), limit: undefined, where: {GroupId: undefined}};
    if (_.has(options, 'limit')) opt.limit = options.limit;
    if (_.has(options, 'GroupId')) opt.where.GroupId = options.GroupId;
    const {count, rows} = await models.Project.findAndCountAll(opt);
    return {count, results: rows.map(r => new Project(r.toJSON()))};
  }

  static async findById(id: number): Promise<Project> {
    const row = await models.Project.findByPk(id);
    return row === null ? null : new Project(row.toJSON());
  }

  static async create(name: string, description?: string): Promise<IProject> {
    try {
      const row: any = await models.Project.create({name, description});
      return new Project(row.toJSON());
    } catch (err) {
      if (err instanceof models.Sequelize.UniqueConstraintError) throw new ProjectNameExistsError(name);
      throw err;
    }
  }

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.GroupId = data.GroupId;
  }

  async velocity(): Promise<number[]> {
    const {results: sprints} = await Sprint.findAllInProject(this.id);
    return sprints.map(s => s.velocity());
  }
}
