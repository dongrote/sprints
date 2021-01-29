import { Router } from 'express';
import projects from  './projects';
import sprints from './sprints';
import stories from './stories';
const router = Router();

router.use('/projects', projects);
router.use('/sprints', sprints);
router.use('/stories', stories);

export default router;