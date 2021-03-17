import _ from 'lodash';
import { Router, Request, Response, NextFunction } from 'express';
import { RequestWithTokens } from './types';
import HttpError from 'http-error-constructor';
import Project from '../core/Project';

const router = Router();

router.get('/', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  const GroupId = Number(req.query.GroupId);
  try {
    if (isNaN(GroupId)) throw new HttpError(400, `invalid GroupId '${req.query.GroupId}'`);
    if (!_.includes(req.accessToken.groupIds(), GroupId)) throw new HttpError(403);
    res.json(await Project.findAll({GroupId}));
  } catch (err) {
    return next(err);
  }
});
router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json(await Project.create(req.body.name, req.body.description));
  } catch (err) {
    return next(err);
  }
});
router.get('/:id', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(Number(req.params.id));
    if (project === null) throw new HttpError(404);
    if (!_.includes(req.accessToken.groupIds(), project.GroupId)) throw new HttpError(403);
    res.json(project);
  } catch (err) {
    return next(err);
  }
});
router.get('/:id/velocity', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(Number(req.params.id));
    if (project === null) throw new HttpError(404);
    if (!_.includes(req.accessToken.groupIds(), project.GroupId)) throw new HttpError(403);
    res.json(await project.velocity());
  } catch (err) {
    return next(err);
  }
});
router.patch('/:id');

export default router;
