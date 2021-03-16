import { Router } from 'express';
import projects from  './projects';
import sprints from './sprints';
import stories from './stories';
import auth from './auth';
const router = Router();

router.use('/auth', auth);
router.use('/projects', projects);
router.use('/sprints', sprints);
router.use('/stories', stories);

export default router;
