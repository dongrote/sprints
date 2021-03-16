import _ from 'lodash';

export = {
  port: (): number => Number(_.get(process.env, 'PORT', 3000)),
  sqliteDatabasePath: (): string => _.get(process.env, 'DBPATH', 'db.sqlite'),
  googleClientId: (): string => _.get(process.env, 'GOOGLE_CLIENT_ID'),
  googleClientSecret: (): string => _.get(process.env, 'GOOGLE_CLIENT_SECRET'),
};
