'use strict';
exports = module.exports = require('express').Router();
const HttpError = require('http-error-constructor'),
  core = require('../core');

exports.get('/healthz', (req, res) => res.sendStatus(200));
exports.post('/projects', async (req, res, next) => {
  try {
    const project = await core.Project.create(req.body.name);
    res.json(project);
  } catch (err) {
    next(err);
  }
});
exports.get('/projects', async (req, res, next) => {
  try {
    res.json(await core.Project.findAll());
  } catch (err) {
    next(err);
  }
});
exports.get('/projects/:ProjectId/velocity', (req, res, next) => setImmediate(next, new HttpError(501)));
exports.post('/projects/:ProjectId/sprints', async (req, res, next) => {
  try {
    const project = await core.Project.findById(Number(req.params.ProjectId));
    if (project === null) throw new HttpError(404);
    res.json(await project.createSprint(req.body.name, req.body));
  } catch (err) {
    next(err);
  }
});
exports.get('/projects/:ProjectId/sprints', async (req, res, next) => {
  try {
    const project = await core.Project.findById(Number(req.params.ProjectId));
    if (project === null) throw new HttpError(404);
    res.json(await project.findAllSprints());
  } catch (err) {
    next(err);
  }
});
exports.post('/projects/:ProjectId/stories', (req, res, next) => setImmediate(next, new HttpError(501)));
exports.get('/projects/:ProjectId/stories', (req, res, next) => setImmediate(next, new HttpError(501)));
exports.get('/sprints/:SprintId/burndown', (req, res, next) => setImmediate(next, new HttpError(501)));
exports.get('/sprints/:SprintId/stories', (req, res, next) => setImmediate(next, new HttpError(501)));
exports.post('/sprints/:SprintId/stories', (req, res, next) => setImmediate(next, new HttpError(501)));
exports.delete('/sprints/:SprintId/stories/:UserStoryId', (req, res, next) => setImmediate(next, new HttpError(501)));