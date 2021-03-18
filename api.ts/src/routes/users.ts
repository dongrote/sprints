import _ from 'lodash';
import { Router } from 'express';
import { RequestWithTokens } from './types';
import User from '../core/User';
const router = Router();

router.get('/me', async (req: RequestWithTokens, res, next) => {
  try {
    const user = await User.findById(req.accessToken.userId());
    res.json(user);
  } catch (err) {
    return next(err);
  }
});

export default router;
