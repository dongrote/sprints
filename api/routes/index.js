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
exports.get('/projects/:ProjectId', async (req, res, next) => {
  try {
    res.json(await core.Project.findById(Number(req.params.ProjectId)));
  } catch (err) {
    next(err);
  }
});
exports.get('/projects/:ProjectId/velocity', async (req, res, next) => {
  try {
    const project = await core.Project.findById(Number(req.params.ProjectId));
    if (project === null) throw new HttpError(404);
    res.json(await project.velocity());
  } catch (err) {
    next(err);
  }
});
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
exports.post('/projects/:ProjectId/stories', async (req, res, next) => {
  try {
    const project = await core.Project.findById(Number(req.params.ProjectId));
    if (project === null) throw new HttpError(404);
    res.json(await project.createUserStory(req.body.story, req.body.points, req.body));
  } catch (err) {
    next(err);
  }
});
exports.get('/projects/:ProjectId/stories', async (req, res, next) => {
  try {
    const project = await core.Project.findById(Number(req.params.ProjectId));
    if (project === null) throw new HttpError(404);
    res.json(await project.findAllUserStories());
  } catch (err) {
    next(err);
  }
});
exports.get('/sprints/:SprintId', async (req, res, next) => {
  try {
    const sprint = await core.Sprint.findById(Number(req.params.SprintId));
    if (sprint === null) throw new HttpError(404);
    res.json(sprint);
  } catch (err) {
    next(err);
  }
});
exports.get('/sprints/:SprintId/burndown', async (req, res, next) => {
  try {
    const sprint = await core.Sprint.findById(Number(req.params.SprintId));
    if (sprint === null) throw new HttpError(404);
    res.json(await sprint.burndown());
  } catch (err) {
    next(err);
  }
});
exports.get('/sprints/:SprintId/available', async (req, res, next) => {
  try {
    const sprint = await core.Sprint.findById(Number(req.params.SprintId));
    if (sprint === null) throw new HttpError(404);
    res.json(await sprint.findAllAvailableStories());
  } catch (err) {
    next(err);
  }
});
exports.get('/sprints/:SprintId/stories', async (req, res, next) => {
  try {
    const sprint = await core.Sprint.findById(Number(req.params.SprintId));
    if (sprint === null) throw new HttpError(404);
    res.json(await sprint.findAllUserStories());
  } catch (err) {
    next(err);
  }
});
exports.post('/sprints/:SprintId/claim', async (req, res, next) => {
  try {
    const sprint = await core.Sprint.findById(Number(req.params.SprintId));
    if (sprint === null) throw new HttpError(404);
    await sprint.claimUserStory(req.body.UserStoryId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});
exports.post('/sprints/:SprintId/complete', async (req, res, next) => {
  try {
    const sprint = await core.Sprint.findById(Number(req.params.SprintId));
    if (sprint === null) throw new HttpError(404);
    await sprint.completeUserStory(req.body.UserStoryId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});
exports.delete('/sprints/:SprintId/stories/:UserStoryId', async (req, res, next) => {
  try {
    const sprint = await core.Sprint.findById(Number(req.params.SprintId));
    if (sprint === null) throw new HttpError(404);
    await sprint.remitUserStory(Number(req.params.UserStoryId));
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});