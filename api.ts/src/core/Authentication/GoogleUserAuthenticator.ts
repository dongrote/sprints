import passport, { Profile } from 'passport';
import { Request } from 'express';
import { OAuth2Strategy as GoogleOAuthStrategy, VerifyFunction } from 'passport-google-oauth';
import env from '../../env';

export default class GoogleUserAuthenticator {
  static installOntoPassport(callbackURL: string): void {
    passport.use('google', new GoogleOAuthStrategy({
      callbackURL,
      clientID: env.googleClientId(),
      clientSecret: env.googleClientSecret(),
      passReqToCallback: true,
    }, GoogleUserAuthenticator.verify));
  }

  static async verify(req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyFunction): Promise<void> {
    console.log('**** GoogleUserAuthenticator req.headers %j', req.headers);
    console.log('**** GoogleUserAuthenticator req.body %j', req.body);
    done(new Error('not implemented'));
  }
}
