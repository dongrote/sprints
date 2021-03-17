import _ from 'lodash';
import { Router } from 'express';
import passport from 'passport';
import TokenSet from '../core/Authentication/TokenSet';

const router = Router();

router.get('/google', passport.authenticate('google', {
  session: false,
  scope: ['openid', 'email', 'profile'],
}));
router.get('/google/callback', passport.initialize(), passport.authenticate('google', {session: false, failureRedirect: '/'}), async (req, res, next): Promise<void> => {
  try {
    // set cookies, redirect to project list
    const tokenSet: TokenSet = _.get(req.user, 'tokens');
    res.cookie('refreshToken', tokenSet.refreshToken.toString(), {httpOnly: true, secure: true});
    res.cookie('accessToken', tokenSet.accessToken.toString(), {httpOnly: true, secure: true});
    res.redirect('/#/groups');
  } catch (err) {
    return next(err)
  }
});
router.get('/logout', (req, res, next) => {
  res.clearCookie('refreshToken', {httpOnly: true, secure: true});
  res.clearCookie('accessToken', {httpOnly: true, secure: true});
  res.redirect('/');
});

export default router;
