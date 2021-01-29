import _ from 'lodash';

export = {
  port: (): number => Number(_.get(process.env, 'PORT', 3000)),
  sqliteDatabasePath: (): string => _.get(process.env, 'DBPATH', 'db.sqlite'),
};