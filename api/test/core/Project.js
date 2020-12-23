'use strict';
const expect = require('expect'),
  simple = require('simple-mock'),
  models = require('../../db/models'),
  Sprint = require('../../core/Sprint'),
  UserStory = require('../../core/UserStory'),
  Project = require('../../core/Project');

describe('Project', () => {
  afterEach(() => simple.restore());
  describe('class methods', () => {
    describe('findAll', () => {
      beforeEach(() => simple.mock(models.Project, 'findAndCountAll'));
      it('returns count and results', async () => {
        models.Project.findAndCountAll.resolveWith({count: 1, rows: [{toJSON: () => ({})}]});
        expect(await Project.findAll()).toEqual({
          count: expect.any(Number),
          results: expect.any(Array),
        });
      });
    });
    describe('findByName', () => {
      beforeEach(() => simple.mock(models.Project, 'findOne'));
      it('returns an instance of Project', async () => {
        models.Project.findOne.resolveWith({toJSON: () => ({})});
        expect(await Project.findByName('foo')).toBeInstanceOf(Project);
        expect(models.Project.findOne.lastCall.arg).toEqual({where: {name: 'foo'}});
      });
      it('returns null when no Project with supplied name is found', async () => {
        models.Project.findOne.resolveWith(null);
        expect(await Project.findByName('foo')).toBeNull();
      });
      it('throws a TypeError when name is not a string', async () => {
        await expect(async () => await Project.findByName()).rejects.toThrow(TypeError);
      });
    });
    describe('findById', () => {
      beforeEach(() => simple.mock(models.Project, 'findByPk'));
      it('returns an instance of Project', async () => {
        models.Project.findByPk.resolveWith({toJSON: () => ({})});
        expect(await Project.findById(0)).toBeInstanceOf(Project);
        expect(models.Project.findByPk.lastCall.arg).toBe(0);
      });
      it('returns null when no Project with supplied id is found', async () => {
        models.Project.findByPk.resolveWith(null);
        expect(await Project.findById(0)).toBeNull();
      });
      it('throws a TypeError when id is not a number', async () => {
        await expect(async () => await Project.findById()).rejects.toThrow(TypeError);
      });
    });
    describe('create', () => {
      beforeEach(() => {
        simple.mock(models.Project, 'create');
        simple.mock(Project, 'findByName');
      });
      it('returns a Project instance', async () => {
        Project.findByName.resolveWith(null);
        models.Project.create.resolveWith({toJSON: () => ({})});
        expect(await Project.create('foo')).toBeInstanceOf(Project);
        expect(models.Project.create.lastCall.arg).toEqual({name: 'foo'});
      });
      it('throws a TypeError when there is no name', async () => {
        await expect(async () => await Project.create()).rejects.toThrow(TypeError);
      });
      it('throws a DuplicateProjectNameError when the project name already exists', async () => {
        Project.findByName.resolveWith(new Project());
        await expect(async () => await Project.create('foo')).rejects.toThrow(Project.DuplicateProjectNameError);
      });
    });
  });
  describe('instance methods', () => {
    let project,
      name;
    describe('id', () => {
      it('returns the ProjectId', () => {
        project = new Project({id: 0});
        expect(project.id()).toBe(0);
      });
    });
    describe('createSprint', () => {
      beforeEach(() => {
        name = `${Math.random()}`;
        simple.mock(Sprint, 'create');
      });
      it('returns an instance of Sprint', async () => {
        project = new Project({});
        Sprint.create.resolveWith(new Sprint());
        expect(await project.createSprint(name)).toBeInstanceOf(Sprint);
      });
      it('passes ProjectId to Sprint.create', async () => {
        const ProjectId = Math.random();
        project = new Project({id: ProjectId});
        Sprint.create.resolveWith(new Sprint());
        await project.createSprint(name);
        expect(Sprint.create.lastCall.arg).toBe(ProjectId);
        expect(Sprint.create.lastCall.args[1]).toBe(name);
      });
      it('passes options to Sprint.create', async () => {
        const ProjectId = Math.random();
        const randomKey = `${Math.random()}`;
        const randomValue = Math.random();
        project = new Project({id: ProjectId});
        Sprint.create.resolveWith(new Sprint());
        await project.createSprint(name, {[randomKey]: randomValue});
        expect(Sprint.create.lastCall.args[2]).toEqual({[randomKey]: randomValue});
      });
    });
    describe('createUserStory', () => {
      beforeEach(() => simple.mock(UserStory, 'create'));
    });
    describe('findAllSprints', () => {
      beforeEach(() => simple.mock(Sprint, 'findAllInProject'));
      it('returns count and results', async () => {
        project = new Project({id: 0});
        Sprint.findAllInProject.resolveWith({count: 0, results: []});
        expect(await project.findAllSprints()).toEqual({
          count: expect.any(Number),
          results: expect.any(Array),
        });
        expect(Sprint.findAllInProject.lastCall.arg).toBe(0);
      });
    });
    describe('findAllUserStories', () => {});
    describe('findAllReadyUserStories', () => {});
    describe('findAllAllocatedUserStories', () => {});
    describe('findAllDoneUserStories', () => {});
    describe('velocityValues', () => {});
  });
});