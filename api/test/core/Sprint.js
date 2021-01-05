'use strict';
const _ = require('lodash'),
  expect = require('expect'),
  simple = require('simple-mock'),
  day = require('dayjs'),
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
    describe('idealBurndownValues', () => {
      it('returns expected values', () => {
        sprint = new Sprint({
          startAt: day().startOf('d').toJSON(),
          finishAt: day().startOf('d').add(14, 'd').toJSON()});
        simple.mock(sprint, 'claimedPoints').returnWith(10);
        expect(sprint.idealBurndownValues()).toEqual([
          [0, 10], [14, 0],
        ]);
      });
    });
    describe('realBurndownValues', () => {
      it('returns expected values', async () => {
        sprint = new Sprint({startAt: day().toJSON(), finishAt: day().add(2, 'w').toJSON()});
        simple.mock(sprint, 'claimedPoints').returnWith(14);
        simple.mock(sprint, 'findAllUserStories').resolveWith({results: _.range(14).map(i => ({
          completedAt: () => day().add(i, 'd').toJSON(),
          points: () => 1,
        }))});
        expect(await sprint.realBurndownValues()).toEqual([
          13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
        ]);
      });
      it('handles late completion of a single story', async () => {
        sprint = new Sprint({startAt: day().toJSON(), finishAt: day().add(2, 'w').toJSON()});
        simple.mock(sprint, 'claimedPoints').returnWith(14);
        simple.mock(sprint, 'findAllUserStories').resolveWith({results: [
          {completedAt: () => day().add(7, 'd').toJSON(), points: () => 7},
          {completedAt: () => null, points: () => 7},
        ]});
        expect(await sprint.realBurndownValues()).toEqual([
          14, 14, 14, 14, 14, 14, 14, 7, 7, 7, 7, 7, 7, 7
        ]);
      });
      it('returns all the same value when no stories are completed', async () => {
        sprint = new Sprint({startAt: day().toJSON(), finishAt: day().add(2, 'w').toJSON()});
        simple.mock(sprint, 'claimedPoints').returnWith(14);
        simple.mock(sprint, 'findAllUserStories').resolveWith({results: _.range(14).map(() => ({
          completedAt: () => null,
          points: () => 1,
        }))});
        expect(await sprint.realBurndownValues()).toEqual([
          14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14
        ]);
      });
    });
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