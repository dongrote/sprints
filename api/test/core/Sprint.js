'use strict';
const expect = require('expect'),
  simple = require('simple-mock'),
  models = require('../../db/models'),
  UserStory = require('../../core/UserStory'),
  Sprint = require('../../core/Sprint');

describe('Sprint', () => {
  afterEach(() => simple.restore());
  describe('class methods', () => {
    describe('create', () => {
      beforeEach(() => simple.mock(models.Sprint, 'create'));
      it('returns a Sprint instance', async () => {
        models.Sprint.create.resolveWith({toJSON: () => ({})});
        expect(await Sprint.create(0, 'foo')).toBeInstanceOf(Sprint);
        expect(models.Sprint.create.lastCall.arg).toEqual({ProjectId: 0, title: 'foo'});
      });
      it('throws a TypeError when ProjectId is not a number', async () => {
        await expect(async () => await Sprint.create()).rejects.toThrow(TypeError);
      });
      it('throws a TypeError when name is not a string', async () => {
        await expect(async () => await Sprint.create(0)).rejects.toThrow(TypeError);
      });
      it('includes startAt when provided', async () => {
        models.Sprint.create.resolveWith({toJSON: () => ({})});
        expect(await Sprint.create(0, 'foo', {start: ''})).toBeInstanceOf(Sprint);
        expect(models.Sprint.create.lastCall.arg).toHaveProperty('startAt');
      });
      it('includes finishAt when provided', async () => {
        models.Sprint.create.resolveWith({toJSON: () => ({})});
        expect(await Sprint.create(0, 'foo', {finish: ''})).toBeInstanceOf(Sprint);
        expect(models.Sprint.create.lastCall.arg).toHaveProperty('finishAt');
      });
      it('includes predictedPoints when provided', async () => {
        models.Sprint.create.resolveWith({toJSON: () => ({})});
        expect(await Sprint.create(0, 'foo', {points: Math.random()})).toBeInstanceOf(Sprint);
        expect(models.Sprint.create.lastCall.arg).toHaveProperty('predictedPoints');
      });
      it('includes description when provided', async () => {
        models.Sprint.create.resolveWith({toJSON: () => ({})});
        expect(await Sprint.create(0, 'foo', {description: ''})).toBeInstanceOf(Sprint);
        expect(models.Sprint.create.lastCall.arg).toHaveProperty('description');
      });
    });
    describe('findAllInProject', () => {
      beforeEach(() => simple.mock(models.Sprint, 'findAndCountAll'));
      it('returns count and results', async () => {
        models.Sprint.findAndCountAll.resolveWith({count: 0, rows: []});
        expect(await Sprint.findAllInProject(0)).toEqual({
          count: expect.any(Number),
          results: expect.any(Array),
        });
        expect(models.Sprint.findAndCountAll.lastCall.arg).toEqual({
          where: {ProjectId: 0},
          order: [['id', 'DESC']],
        });
      });
    });
  });
  describe('instance methods', () => {
    let sprint,
      SprintId;
    beforeEach(() => {
      SprintId = Math.random();
    });
    describe('id', () => {
      it('returns the id', () => {
        sprint = new Sprint({id: SprintId});
        expect(sprint.id()).toBe(SprintId);
      });
    });
    describe('findAllUserStories', () => {});
    describe('findUserStoryById', () => {
      beforeEach(() => simple.mock(UserStory, 'findInSprintById'));
      it('returns null when no match is found', async () => {
        const UserStoryId = Math.random();
        sprint = new Sprint({id: SprintId});
        UserStory.findInSprintById.resolveWith(null);
        expect(await sprint.findUserStoryById(UserStoryId)).toBeNull();
        expect(UserStory.findInSprintById.lastCall.args).toEqual([SprintId, UserStoryId]);
      });
      it('returns an instance of UserStory', async () => {
        const UserStoryId = Math.random();
        sprint = new Sprint({id: SprintId});
        UserStory.findInSprintById.resolveWith(new UserStory({id: UserStoryId}));
        expect(await sprint.findUserStoryById(UserStoryId)).toBeInstanceOf(UserStory);
        expect(UserStory.findInSprintById.lastCall.args).toEqual([SprintId, UserStoryId]);
      });
    });
    describe('claimUserStory', () => {
      let UserStoryId;
      beforeEach(() => {
        UserStoryId = Math.random();
        sprint = new Sprint({id: SprintId});
        simple.mock(sprint, 'findUserStoryById');
        simple.mock(models.UserStoryClaims, 'create');
        simple.mock(models.Sprint, 'increment');
      });
      it('does nothing when UserStory is already claimed', async () => {
        sprint.findUserStoryById.resolveWith(new UserStory({id: UserStoryId}));
        await sprint.claimUserStory(UserStoryId);
        expect(sprint.findUserStoryById.lastCall.arg).toBe(UserStoryId);
      });
      it('adds UserStory to claims and updates claimedPoints', async () => {
        const storyPoints = Math.random();
        sprint.findUserStoryById.resolveWith(null).resolveWith(new UserStory({id: UserStoryId, points: storyPoints}));
        models.UserStoryClaims.create.resolveWith({});
        models.Sprint.increment.resolveWith();
        await sprint.claimUserStory(UserStoryId);
        expect(models.UserStoryClaims.create.lastCall.arg).toEqual({SprintId, UserStoryId});
        expect(models.Sprint.increment.lastCall.arg).toEqual('claimedPoints');
        expect(models.Sprint.increment.lastCall.args[1]).toEqual({where: {id: SprintId}, by: storyPoints});
      });
    });
    describe('remitUserStory', () => {});
    describe('completeUserStory', () => {
      beforeEach(() => simple.mock(models.Sprint, 'increment'));
      it('gracefully handles null UserStory', async () => {
        sprint = new Sprint({});
        simple.mock(sprint, 'findUserStoryById').resolveWith(null);
        await sprint.completeUserStory(0);
      });
      it('marks UserStory complete', async () => {
        const UserStoryId = Math.random();
        sprint = new Sprint({id: SprintId});
        const markComplete = simple.mock().resolveWith();
        simple.mock(sprint, 'findUserStoryById').resolveWith({markComplete, points: () => 5});
        models.Sprint.increment.resolveWith();
        await sprint.completeUserStory(UserStoryId);
        expect(sprint.findUserStoryById.lastCall.arg).toBe(UserStoryId);
        expect(markComplete.lastCall.arg).toBe(SprintId);
        expect(models.Sprint.increment.lastCall.arg).toBe('completedPoints');
        expect(models.Sprint.increment.lastCall.args[1]).toEqual({where: {id: SprintId}, by: 5});
      });
    });
    describe('burndownValues', () => {});
    describe('velocity', () => {
      it('returns completedPoints', () => {
        const completedPoints = Math.random();
        sprint = new Sprint({completedPoints});
        expect(sprint.velocity()).toBe(completedPoints);
      });
    });
    describe('setTitle', () => {});
    describe('setStart', () => {});
    describe('setFinish', () => {});
    describe('setPointPrediction', () => {});
  });
});