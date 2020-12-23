'use strict';
const expect = require('expect'),
  simple = require('simple-mock'),
  Sprint = require('../../core/Sprint'),
  UserStory = require('../../core/UserStory'),
  Project = require('../../core/Project');

describe('Project', () => {
  afterEach(() => simple.restore());
  describe('class methods', () => {
    describe('findAll', () => {});
    describe('findByName', () => {
      it.skip('returns an instance of Project', async () => {
        expect(await Project.findByName('foo')).toBeInstanceOf(Project);
      });
      it('returns null when no Project with supplied name is found', async () => {
        expect(await Project.findByName('foo')).toBeNull();
      });
      it('throws a TypeError when name is not a string', async () => {
        await expect(async () => await Project.findByName()).rejects.toThrow(TypeError);
      });
    });
    describe('create', () => {
      beforeEach(() => {
        simple.mock(Project, 'findByName');
      });
      it('returns a Project instance', async () => {
        Project.findByName.resolveWith(null);
        expect(await Project.create('foo')).toBeInstanceOf(Project);
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
    describe('findAllSprints', () => {});
    describe('findAllUserStories', () => {});
    describe('findAllReadyUserStories', () => {});
    describe('findAllAllocatedUserStories', () => {});
    describe('findAllDoneUserStories', () => {});
    describe('velocityValues', () => {});
  });
});