import _ = require('lodash');
import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-error-constructor';
import RefreshToken from '../Authentication/RefreshToken';
import AccessToken from '../Authentication/AccessToken';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!_.has(req.cookies, 'refreshToken') && !_.has(req.cookies, 'accessToken')) return next(new HttpError(401));
  try {
    const [refreshToken, accessToken] = await Promise.all([
      RefreshToken.createFromEncoded(req.cookies.refreshToken),
      AccessToken.createFromEncoded(req.cookies.accessToken),
    ]);
    await Promise.all([refreshToken.verify(), accessToken.verify()]);
    _.assignIn(req, {refreshToken, accessToken});
    next();  
  } catch (err) {
    return next(err);
  }
};
