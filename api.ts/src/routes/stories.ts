import { Response, NextFunction, Router } from 'express';
import { RequestWithTokens } from './types';
import HttpError from 'http-error-constructor';
import _ from 'lodash';
import Project from '../core/Project';
import Story from '../core/Story';
import Sprint from '../core/Sprint';

const router = Router();

router.get('/', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void|Response> => {
  const ProjectId = Number(req.query.ProjectId);
  const SprintId = Number(req.query.SprintId);
  const available = _.has(req.query, 'available');
  try {
    if (!isNaN(ProjectId)) {
      if (!req.accessToken.belongsToGroupId(await Project.findGroupId(ProjectId))) throw new HttpError(403);
      return res.json(await Story.findAllInProject(ProjectId));
    }
    if (!isNaN(SprintId)) {
      if (!req.accessToken.belongsToGroupId(await Sprint.findGroupId(SprintId))) throw new HttpError(403);
      return res.json(available ? await Story.findAllAvailableForSprint(SprintId) : await Story.findAllInSprint(SprintId));
    }
    throw new HttpError(400, `missing ProjectId or SprintId`);
  } catch (err) {
    return next(err);
  }
});
router.post('/', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.accessToken.belongsToGroupId(await Project.findGroupId(req.body.ProjectId))) throw new HttpError(403);
    res.json(await Story.createInProject({
      ProjectId: req.body.ProjectId,
      title: req.body.title,
      points: req.body.points,
      description: req.body.description || null,
    }));
  } catch (err) {
    return next(err);
  }
});
router.get('/:id', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  const StoryId = Number(req.params.id);
  try {
    if (isNaN(StoryId)) throw new HttpError(400, `invalid StoryId: '${req.params.id}'`);
    if (!req.accessToken.belongsToGroupId(await Story.findGroupId(StoryId))) throw new HttpError(403);
    res.json(await Story.findById(StoryId));
  } catch (err) {
    return next(err);
  }
});
router.post('/:id/gild', async (req: RequestWithTokens, res, next) => {
  try {
    const story = await Story.findById(Number(req.params.id));
    await story.gild(req.accessToken);
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});
router.patch('/:id', (req, res, next) => next(new HttpError(501)));

export default router;
