'use strict';
const express = require('express');
exports = module.exports = express();
const _ = require('lodash'),
  log = require('debug-logger')('api:app'),
  path = require('path'),
  HttpError = require('http-error-constructor'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  router = require('./routes');

exports.use(logger('dev'));
exports.use(express.json());
exports.use(express.urlencoded({ extended: false }));
exports.use(cookieParser());

exports.use('/', express.static(path.join(__dirname, 'public')));
exports.use('/api', router);
exports.use((req, res, next) => setImmediate(next, new HttpError(404)));
exports.use((err, req, res, next) => {
  const statusCode = _.get(err, 'statusCode', 500);
  log.error(err);
  res.status(statusCode).json({error: {statusCode, message: err.message}});
});