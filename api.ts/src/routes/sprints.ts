import { Response, NextFunction, Router } from 'express';
import { RequestWithTokens } from './types';
import _ from 'lodash';
import HttpError from 'http-error-constructor';
import BurndownChart from '../core/BurndownChart';
import { GroupRole } from '../core/Group';
import Project from '../core/Project';
import Sprint from '../core/Sprint';
import SprintTransaction, { SprintTransactionAction } from '../core/SprintTransaction';
import DailyStandup from '../core/DailyStandup';

const router = Router();

router.get('/', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  const ProjectId = Number(req.query.ProjectId);
  const options = {
      offset: Number(_.get(req.query, 'offset', 0)),
      reverse: _.has(req.query, 'reverse'),
    };
  if (_.has(req.query, 'limit')) options['limit'] = Number(req.query.limit);
  try {
    if (!req.accessToken.belongsToGroupId(await Project.findGroupId(ProjectId))) throw new HttpError(403);
    res.json(isNaN(ProjectId) ? await Sprint.findAll(options) : await Sprint.findAllInProject(ProjectId, options));
  } catch (err) {
    return next(err);
  }
});
router.post('/', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.accessToken.groupRole(await Project.findGroupId(req.body.ProjectId)) !== GroupRole.OWNER) throw new HttpError(403);
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
router.get('/:id', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  const SprintId = Number(req.params.id);
  try {
    if (isNaN(SprintId)) throw new HttpError(400, `invalid SprintId: '${req.params.id}'`);
    const sprint = await Sprint.findById(SprintId);
    if (!req.accessToken.belongsToGroupId(await Project.findGroupId(sprint.ProjectId))) throw new HttpError(403);
    res.json(sprint);
  } catch (err) {
    return next(err);
  }
});
router.get('/:id/burndown', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  const SprintId = Number(req.params.id);
  try {
    if (isNaN(SprintId)) throw new HttpError(400, `invalid SprintId: '${req.params.id}'`);
    const sprint = await Sprint.findById(SprintId);
    if (!req.accessToken.belongsToGroupId(await Project.findGroupId(sprint.ProjectId))) throw new HttpError(403);
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
router.get('/:id/transactions', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  const SprintId = Number(req.params.id);
  const options = {offset: Number(_.get(req.query, 'offset', 0)), reverse: _.has(req.query, 'reverse')};
  if (_.has(req.query, 'limit')) options['limit'] = Number(req.query.limit);
  try {
    if (isNaN(SprintId)) throw new HttpError(400, `invalid SprintId: '${req.params.id}'`);
    const sprint = await Sprint.findById(SprintId);
    if (!req.accessToken.belongsToGroupId(await Project.findGroupId(sprint.ProjectId))) throw new HttpError(403);
    res.json(await SprintTransaction.findAllInSprint(SprintId, options));
  } catch (err) {
    return next(err);
  }
});
router.post('/:id/transactions', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  const timestamp = _.has(req.body, 'timestamp') ? new Date(req.body.timestamp) : new Date();
  try {
    const SprintId = Number(req.params.id);
    const action: SprintTransactionAction = req.body.action;
    const sprint = await Sprint.findById(SprintId);
    const GroupId = await Project.findGroupId(sprint.ProjectId);
    if (!req.accessToken.groupRoleIncludes(GroupId, [GroupRole.OWNER, GroupRole.DEVELOPER])) throw new HttpError(403);
    if (action === SprintTransactionAction.Claim) await sprint.claimStory(req.body.StoryId, {timestamp});
    if (action === SprintTransactionAction.Remit) await sprint.remitStory(req.body.StoryId, {timestamp});
    if (action === SprintTransactionAction.Complete) await sprint.completeStory(req.body.StoryId, {timestamp});
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});
router.patch('/:id', (req, res, next) => next(new HttpError(501)));
router.post('/:id/standups', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  try {
    const SprintId = Number(req.params.id);
    const sprint = await Sprint.findById(SprintId);
    const GroupId = await Project.findGroupId(sprint.ProjectId);
    if (!req.accessToken.groupRoleIncludes(GroupId, [GroupRole.DEVELOPER])) throw new HttpError(403);
    const dailyStandup = await DailyStandup.create({
      SprintId,
      createdBy: req.accessToken.userId(),
      whatDidIDoYesterday: req.body.whatDidIDoYesterday,
      whatAmIDoingToday: req.body.whatAmIDoingToday,
      whatIsInMyWay: req.body.whatIsInMyWay,
    });
    res.json(dailyStandup);
  } catch (err) {
    return next(err);
  }
});
router.get('/:id/standups', async (req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> => {
  const SprintId = Number(req.params.id);
  const options = {offset: Number(_.get(req.query, 'offset', 0)), reverse: _.has(req.query, 'reverse')};
  if (_.has(req.query, 'limit')) options['limit'] = Number(req.query.limit);
  try {
    if (isNaN(SprintId)) throw new HttpError(400, `invalid SprintId: '${req.params.id}'`);
    const sprint = await Sprint.findById(SprintId);
    if (!req.accessToken.belongsToGroupId(await Project.findGroupId(sprint.ProjectId))) throw new HttpError(403);
    res.json(await DailyStandup.findAllInSprint(SprintId, options));
  } catch (err) {
    return next(err);
  }
});

export default router;
