import { Router, Request, Response, NextFunction } from 'express';
import HttpError from 'http-error-constructor';
import Project from '../core/Project';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json(await Project.findAll());
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
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(Number(req.params.id));
    if (project === null) throw new HttpError(404);
    res.json(project);
  } catch (err) {
    return next(err);
  }
});
router.get('/:id/velocity', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(Number(req.params.id));
    if (project === null) throw new HttpError(404);
    res.json(await project.velocity());
  } catch (err) {
    return next(err);
  }
});
router.patch('/:id');

export default router;
