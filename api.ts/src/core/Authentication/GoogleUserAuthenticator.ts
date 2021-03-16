import passport, { Profile } from 'passport';
import { OAuth2Strategy as GoogleOAuthStrategy, VerifyFunction } from 'passport-google-oauth';
import _ from 'lodash';
import env from '../../env';
import User from '../User';
import TokenSet from './TokenSet';
import DebugLogger from 'debug-logger';

const log = DebugLogger('GoogleUserAuthenticator');

export default class GoogleUserAuthenticator {
  static installOntoPassport(): void {
    passport.use('google', new GoogleOAuthStrategy({
      callbackURL: env.googleCallbackUrl(),
      clientID: env.googleClientId(),
      clientSecret: env.googleClientSecret(),
    }, GoogleUserAuthenticator.verify));
  }

  static async verify(accessToken: string, refreshToken: string, profile: Profile, done: VerifyFunction): Promise<void> {
    try {
      log.debug('profile', profile);
      const user = await User.findOrCreateByEmail(_.get(_.first(profile.emails), 'value'), {
        identityProvider: 'google',
        systemRole: 'user',
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
      });
      done(null, {tokens: await TokenSet.createForUser(user)});
    } catch (err) {
      return done(err);
    }
  }
}
