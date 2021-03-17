import { Router } from 'express';
import { RequestWithTokens } from './types';
import Group from '../core/Group';

const router = Router();

router.post('/', async (req: RequestWithTokens, res, next) => {
  try {
    const group = await Group.create({
      name: req.body.name,
      ownerId: req.accessToken.userId(),
    });
    res.json(group);
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req: RequestWithTokens, res, next) => {
  try {
    const groups = await Group.findAll({id: req.accessToken.groupIds()});
    res.json(groups);
  } catch (err) {
    return next(err);
  }
});

export default router;
