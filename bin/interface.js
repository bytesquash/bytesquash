/**
 * CLI manager
 */

const sqz = require('./ByteSquash');
const path = require('path');
const colors = require('colors/safe');
const _ = require('lodash');
const walkSync = require('walk-sync');

const settings = require('../package.json');

const bin = Object.keys(settings.bin)[0];

/* eslint no-param-reassign: 0, no-shadow: 0, prefer-template : 0 */