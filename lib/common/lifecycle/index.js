'use strict';

const colors  = require('colors');
const Promise = require('bluebird');
const _       = require('lodash');

/**
 * Class that manages CLI's lifecycle
 */
class Lifecycle {
  constructor(bsq) {
    this.bsq = bsq;
  }

  /**
   * Run each event from the lifecycle
   *
   * @param {Array} lifecycle - lifecycle array
   */
  run(lifecycle) {
    const hooks = this.sortHooks(lifecycle);

    return new Promise((resolve) => {
    });
  }
}

module.exports = Lifecycle;
