import { Router } from 'express';

const router = Router();

router.get('/');
router.post('/');
router.get('/:id');
router.get('/:id/velocity');
router.patch('/:id');

export default router;