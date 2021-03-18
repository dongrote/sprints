import _ from 'lodash';
import { Router, Response, NextFunction } from 'express';
import { RequestWithTokens } from './types';
import HttpError from 'http-error-constructor';
import Project from '../core/Project';
import {GroupRole} from '../core/Group';

const router = Router();

router.get('/', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  const GroupId = Number(req.query.GroupId);
  try {
    if (isNaN(GroupId)) throw new HttpError(400, `invalid GroupId '${req.query.GroupId}'`);
    if (!req.accessToken.belongsToGroupId(GroupId)) throw new HttpError(403);
    res.json(await Project.findAll({GroupId}));
  } catch (err) {
    return next(err);
  }
});
router.post('/', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.accessToken.groupRole(req.body.GroupId) !== GroupRole.OWNER) throw new HttpError(403);
    res.json(await Project.create(req.body.GroupId, req.body.name, req.body.description));
  } catch (err) {
    return next(err);
  }
});
router.get('/:id', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(Number(req.params.id));
    if (project === null) throw new HttpError(404);
    if (!req.accessToken.belongsToGroupId(project.GroupId)) throw new HttpError(403);
    res.json(project);
  } catch (err) {
    return next(err);
  }
});
router.get('/:id/velocity', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(Number(req.params.id));
    if (!req.accessToken.belongsToGroupId(project.GroupId)) throw new HttpError(403);
    res.json(await project.velocity());
  } catch (err) {
    return next(err);
  }
});
router.patch('/:id', async (req, res, next): Promise<void> => next(new HttpError(501)));

export default router;
