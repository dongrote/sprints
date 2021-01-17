import { Request, Response, NextFunction, Router } from 'express';
import HttpError from 'http-error-constructor';
import _ from 'lodash';
import Story from '../core/Story';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void|Response> => {
  const ProjectId = Number(req.query.ProjectId);
  const SprintId = Number(req.query.SprintId);
  const available = _.has(req.query, 'available');
  try {
    if (!isNaN(ProjectId)) return res.json(await Story.findAllInProject(ProjectId));
    if (!isNaN(SprintId)) return res.json(available ? await Story.findAllAvailableForSprint(SprintId) : await Story.findAllInSprint(SprintId));
    throw new HttpError(400, `missing ProjectId or SprintId`);
  } catch (err) {
    return next(err);
  }
});
router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
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
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const StoryId = Number(req.params.id);
  try {
    if (isNaN(StoryId)) throw new HttpError(400, `invalid StoryId: '${req.params.id}'`);
    res.json(await Story.findById(StoryId));
  } catch (err) {
    return next(err);
  }
});
router.patch('/:id');

export default router;
