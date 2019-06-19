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

  compile(type, stage) {
    return new Promise((resolve) => {
      const compile = new Compile(this.bsq, type, stage);
      compile.run().then(() => {
        resolve();
      });
    });
  }
}

module.exports = Run;
