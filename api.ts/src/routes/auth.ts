import { Router } from 'express';
import HttpError from 'http-error-constructor';
import passport from 'passport';

const router = Router();

router.post('/google', passport.authenticate('google', {
  session: false,
  scope: ['openid', 'email', 'profile'],
}));
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}, async (req, res): Promise<void> => {
  // set cookies, redirect to project list
  console.log('**** req.user %j', req.user);
  res.redirect('/#/projects');
}));
router.get('/logout');

export default router;
