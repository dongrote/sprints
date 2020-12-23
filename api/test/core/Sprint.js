'use strict';
const expect = require('expect'),
  simple = require('simple-mock'),
  Sprint = require('../../core/Sprint');

describe('Sprint', () => {
  afterEach(() => simple.restore());
  describe('class methods', () => {
    describe('create', () => {
      it('returns a Sprint instance', async () => {
        expect(await Sprint.create(0, 'foo')).toBeInstanceOf(Sprint);
      });
      it('throws a TypeError when ProjectId is not a number', async () => {
        await expect(async () => await Sprint.create()).rejects.toThrow(TypeError);
      });
      it('throws a TypeError when name is not a string', async () => {
        await expect(async () => await Sprint.create(0)).rejects.toThrow(TypeError);
      });
    });
  });
  describe('instance methods', () => {
    describe('findAllUserStories', () => {});
    describe('claimUserStory', () => {});
    describe('remitUserStory', () => {});
    describe('completeUserStory', () => {});
    describe('burndownValues', () => {});
    describe('velocity', () => {});
  });
});