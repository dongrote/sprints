import _ from 'lodash';

export = {
  port: (): number => Number(_.get(process.env, 'PORT', 3000)),
  sqliteDatabasePath: (): string => _.get(process.env, 'DBPATH', 'db.sqlite'),
  googleClientId: (): string => _.get(process.env, 'GOOGLE_CLIENT_ID'),
  googleClientSecret: (): string => _.get(process.env, 'GOOGLE_CLIENT_SECRET'),
  googleCallbackUrl: (): string => _.get(process.env, 'GOOGLE_CALLBACK_URL'),
  tokenSigningKey: (): string => _.get(process.env, 'TOKEN_SIGNING_KEY', 'secret'),
  refreshTokenExpiresInSeconds: (): number => _.get(process.env, 'REFRESH_TOKEN_EXPIRES_IN_SECONDS', 3600),
  accessTokenExpiresInSeconds: (): number => _.get(process.env, 'ACCESS_TOKEN_EXPIRES_IN_SECONDS', 180),
};
