import { Request, Response, NextFunction, Router } from 'express';
import _ from 'lodash';
import HttpError from 'http-error-constructor';
import BurndownChart from '../core/BurndownChart';
import Sprint from '../core/Sprint';
import SprintTransaction from '../core/SprintTransaction';
import { SprintTransactionAction } from '../core/types';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const ProjectId = Number(req.query.ProjectId);
  const options = {
      offset: Number(_.get(req.query, 'offset', 0)),
      reverse: _.has(req.query, 'reverse'),
    };
  if (_.has(req.query, 'limit')) options['limit'] = Number(req.query.limit);
  try {
    res.json(isNaN(ProjectId) ? await Sprint.findAll(options) : await Sprint.findAllInProject(ProjectId, options));
  } catch (err) {
    return next(err);
  }
});
router.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json(await Sprint.createInProject(req.body.ProjectId, {
      name: req.body.name,
      predictedPoints: req.body.points,
      startAt: req.body.startAt,
      endAt: req.body.endAt,
    }));
  } catch (err) {
    return next(err);
  }
});
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
  const options = {offset: Number(_.get(req.query, 'offset', 0)), reverse: _.has(req.query, 'reverse')};
  if (_.has(req.query, 'limit')) options['limit'] = Number(req.query.limit);
  try {
    if (isNaN(SprintId)) throw new HttpError(400, `invalid SprintId: '${req.params.id}'`);
    res.json(await SprintTransaction.findAllInSprint(SprintId, options));
  } catch (err) {
    return next(err);
  }
});
router.post('/:id/transactions', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const timestamp = _.has(req.body, 'timestamp') ? new Date(req.body.timestamp) : new Date();
  try {
    const SprintId = Number(req.params.id);
    const action: SprintTransactionAction = req.body.action;
    const sprint = await Sprint.findById(SprintId);
    if (sprint === null) throw new HttpError(404);
    if (action === SprintTransactionAction.Claim) await sprint.claimStory(req.body.StoryId, {timestamp});
    if (action === SprintTransactionAction.Remit) await sprint.remitStory(req.body.StoryId, {timestamp});
    if (action === SprintTransactionAction.Complete) await sprint.completeStory(req.body.StoryId, {timestamp});
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});
router.patch('/:id');

export default router;
