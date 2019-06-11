'use strict';

const child   = require('child_process');
const Promise = require('bluebird');
const path    = require('path');
const colors  = require('colors');

/**
 * Class for running spawning commands
 */
class Command {
  constructor(bsq) {
    this.bsq = bsq;
  }

  /**
   *
   * @param bin
   * @param args
   */
  run(description, bin, args, noExit) {
    return new Promise((resolve, reject) => {
      const normalizedBin = path.normalize(bin);

    });
  }
}

module.exports = Command;