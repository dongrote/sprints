import { Router } from 'express';
import HttpError from 'http-error-constructor';
import { RequestWithTokens } from './types';
import Group, { GroupRole } from '../core/Group';
import TokenSet from '../core/Authentication/TokenSet';

const router = Router();

router.post('/', async (req: RequestWithTokens, res, next) => {
  const tokens = new TokenSet(req.refreshToken, req.accessToken);
  try {
    const group = await Group.create({
      name: req.body.name,
      ownerId: req.accessToken.userId(),
    });
    await tokens.refreshAccessToken();
    req.accessToken = tokens.accessToken;
    res.cookie('accessToken', req.accessToken.toString(), {httpOnly: true, secure: true});
    res.json(group);
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req: RequestWithTokens, res, next) => {
  try {
    res.json(await Group.findAll({id: req.accessToken.groupIds()}));
  } catch (err) {
    return next(err);
  }
});

router.get('/:GroupId/members', async (req: RequestWithTokens, res, next) => {
  const GroupId = Number(req.params.GroupId);
  try {
    if (!req.accessToken.belongsToGroupId(GroupId)) throw new HttpError(403);
    const group = await Group.findById(GroupId);
    res.json(await group.findAllMembers());
  } catch (err) {
    return next(err);
  }
});

router.post('/role', async (req: RequestWithTokens, res, next) => {
  try {
    if (req.accessToken.groupRole(req.body.GroupId) !== GroupRole.OWNER) throw new HttpError(403);
    const group = await Group.findById(req.body.GroupId);
    await group.addUserRole(req.body.UserId, req.body.role);
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});

router.patch('/role', async (req: RequestWithTokens, res, next) => {
  try {
    if (req.accessToken.groupRole(req.body.GroupId) !== GroupRole.OWNER) throw new HttpError(403);
    const group = await Group.findById(req.body.GroupId);
    await group.changeUserRole(req.body.UserId, req.body.role);
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});

router.delete('/role', async (req: RequestWithTokens, res, next) => {
  try {
    if (req.accessToken.groupRole(req.body.GroupId) !== GroupRole.OWNER) throw new HttpError(403);
    const group = await Group.findById(req.body.GroupId);
    await group.removeUserRole(req.body.UserId);
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});

export default router;
