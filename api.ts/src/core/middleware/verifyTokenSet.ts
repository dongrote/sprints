import _ = require('lodash');
import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-error-constructor';
import RefreshToken from '../Authentication/RefreshToken';
import AccessToken from '../Authentication/AccessToken';
import TokenSet from '../Authentication/TokenSet';
import DebugLogger from 'debug-logger';

const log = DebugLogger('middleware:tokens'),
  cookieOptions = {httpOnly: true, secure: true};

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!_.has(req.cookies, 'refreshToken') && !_.has(req.cookies, 'accessToken')) return next(new HttpError(401));
  try {
    const [refreshToken, accessToken] = await Promise.all([
      RefreshToken.createFromEncoded(req.cookies.refreshToken),
      AccessToken.createFromEncoded(req.cookies.accessToken),
    ]);
    const tokenSet = new TokenSet(refreshToken, accessToken);
    await tokenSet.verify();
    _.assignIn(req, {refreshToken: tokenSet.refreshToken, accessToken: tokenSet.accessToken});
    if (req.cookies.accessToken !== tokenSet.accessToken.toString()) res.cookie('accessToken', tokenSet.accessToken.toString(), cookieOptions);
    next();  
  } catch (err) {
    log.error(err);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('accessToken', cookieOptions);
    res.redirect('/');
  }
};
