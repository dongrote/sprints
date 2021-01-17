import { Request, Response, NextFunction, Router } from 'express';
import HttpError from 'http-error-constructor';
import BurndownChart from '../core/BurndownChart';
import Sprint from '../core/Sprint';
import SprintTransaction from '../core/SprintTransaction';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const ProjectId = Number(req.query.ProjectId);
  try {
    res.json(isNaN(ProjectId) ? await Sprint.findAll() : await Sprint.findAllInProject(ProjectId));
  } catch (err) {
    return next(err);
  }
});
router.post('/');
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const SprintId = Number(req.params.id);
  try {
    if (isNaN(SprintId)) throw new HttpError(400, `invalid SprintId: '${req.params.id}'`);
    res.json(await Sprint.findById(SprintId));
  } catch (err) {
    return next(err);
  }
});
router.get('/:id/burndown', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const SprintId = Number(req.params.id);
  try {
    if (isNaN(SprintId)) throw new HttpError(400, `invalid SprintId: '${req.params.id}'`);
    const burndown = await BurndownChart.createFromSprint(SprintId);
    res.json({
      labels: await burndown.labels(),
      realValues: await burndown.realValues(),
      idealValues: await burndown.idealValues(),
    });
  } catch (err) {
    return next(err);
  }
});
router.get('/:id/transactions', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const SprintId = Number(req.params.id);
  try {
    if (isNaN(SprintId)) throw new HttpError(400, `invalid SprintId: '${req.params.id}'`);
    res.json(await SprintTransaction.findAllInSprint(SprintId));
  } catch (err) {
    return next(err);
  }
});
router.patch('/:id');

export default router;
