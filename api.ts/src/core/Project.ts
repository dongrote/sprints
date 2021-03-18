import { IProject, PaginationOptions, PaginatedResults } from './types';
import _ from 'lodash';
import models from '../db/models';
import Sprint from './Sprint';

export class ProjectError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProjectError';
  }
}

export class ProjectNameExistsError extends ProjectError {
  projectName: string;
  constructor(name) {
    super(`Project with name '${name}' already exists.`);
    this.name = 'ProjectNameExistsError';
    this.projectName = name;
  }
}

export class ProjectIdNotFoundError extends ProjectError {
  id: number;
  constructor(id) {
    super(`Project ID '${id}' not found.`);
    this.name = 'ProjectIdNotFoundError';
    this.id = id;
  }
}

export default class Project implements IProject {
  id: number;
  GroupId: number;
  name: string;
  description?: string;

  static async findAll(options?: PaginationOptions & {GroupId?: Array<number>|number}): Promise<PaginatedResults<Project>> {
    const opt = {order: [['name']], offset: _.get(options, 'offset', 0), limit: undefined, where: {GroupId: undefined}};
    if (_.has(options, 'limit')) opt.limit = options.limit;
    if (_.has(options, 'GroupId')) opt.where.GroupId = options.GroupId;
    const {count, rows} = await models.Project.findAndCountAll(opt);
    return {count, results: rows.map(r => new Project(r.toJSON()))};
  }

  static async findById(id: number): Promise<Project> {
    const row = await models.Project.findByPk(id);
    if (row === null) throw new ProjectIdNotFoundError(id);
    return new Project(row.toJSON());
  }

  static async findByIdInGroups(id: number, GroupId: Array<number>|number) {
    const row = await models.Project.findOne({where: {id, GroupId}});
    if (row === null) throw new ProjectIdNotFoundError(id);
    return new Project(row.toJSON());
  }

  static async create(GroupId: number, name: string, description?: string): Promise<Project> {
    try {
      const row: any = await models.Project.create({GroupId, name, description});
      return new Project(row.toJSON());
    } catch (err) {
      if (err instanceof models.Sequelize.UniqueConstraintError) throw new ProjectNameExistsError(name);
      throw err;
    }
  }

  static async findGroupId(ProjectId: number): Promise<number> {
    const row = await models.Project.findByPk(ProjectId, {attributes: ['GroupId']});
    if (row === null) throw new ProjectIdNotFoundError(ProjectId);
    return row.GroupId;
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
