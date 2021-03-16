import _ from 'lodash';
import { Router, Request } from 'express';
import AccessToken from '../core/Authentication/AccessToken';
import User from '../core/User';
const router = Router();

router.get('/me', async (req: Request & {accessToken: AccessToken}, res, next) => {
  try {
    const user = await User.findById(req.accessToken.userId());
    res.json(user);
  } catch (err) {
    return next(err);
  }
});

export default router;
