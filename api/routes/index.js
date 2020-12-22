'use strict';
exports = module.exports = require('express').Router();

exports.get('/healthz', (req, res) => res.sendStatus(200));