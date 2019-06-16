'use strict';

const colors  = require('colors');
const Promise = require('bluebird');

/**
 * Class manages Projects config .
 */
class Config {
  constructor(bsq) {
    this.bsq = bsq;
  }
}

module.exports = Config;
