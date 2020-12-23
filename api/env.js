'use strict';
const _ = require('lodash');

exports = module.exports = {
  port: () => Number(_.get(process.env, 'PORT', 3000)),
  sqliteDatabasePath: () => _.get(process.env, 'DBPATH', 'db.sqlite'),
};