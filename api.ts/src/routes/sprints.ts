import { Router } from 'express';

const router = Router();

router.get('/');
router.post('/');
router.get('/:id');
router.get('/:id/burndown');
router.get('/:id/transactions');
router.patch('/:id');

export default router;