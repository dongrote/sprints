import _ from 'lodash';
import { NextFunction, Response, Router } from 'express';
import HttpError from 'http-error-constructor';
import { RequestWithTokens } from './types';
import User from '../core/User';
import { SystemRole } from '../core/Authentication/AccessToken';
const router = Router();

const requireRole = (role: SystemRole) => (req: RequestWithTokens, res: Response, next: NextFunction) => next(req.accessToken.systemRole() === role ? undefined : new HttpError(403));

router.get('/', requireRole(SystemRole.ADMIN), async (req: RequestWithTokens, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    return next(err);
  }
});

router.get('/me', async (req: RequestWithTokens, res, next) => {
  try {
    const user = await User.findById(req.accessToken.userId());
    res.json(user);
  } catch (err) {
    return next(err);
  }
});

router.get('/:UserId/groups', requireRole(SystemRole.ADMIN), async (req: RequestWithTokens, res, next) => {
  const UserId = Number(req.params.UserId);
  try {
    const user = await User.findById(UserId);
    res.json(await user.groupRoleBindings());
  } catch (err) {
    return next(err);
  }
});

export default router;
