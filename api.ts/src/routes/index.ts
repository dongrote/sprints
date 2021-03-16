import { Router } from 'express';
import projects from  './projects';
import sprints from './sprints';
import stories from './stories';
import auth from './auth';
import users from './users';
import verifyTokenSet from '../core/middleware/verifyTokenSet';
const router = Router();

router.use('/auth', auth);
router.use('/users', verifyTokenSet, users);
router.use('/projects', verifyTokenSet, projects);
router.use('/sprints', verifyTokenSet, sprints);
router.use('/stories', verifyTokenSet, stories);

export default router;
