'use strict';

const Promise      = require('bluebird');
const Compile = require('./lib');

/**
 * Class representing compiling initializing
 */
class Run {
  constructor(bsq) {
    this.bsq     = bsq;
  }
}

module.exports = Run;
