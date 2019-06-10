'use strict';

const colors = require('colors');
const _      = require('lodash');

/**
 * Class that represents CLI logging.
 */
class Log {
  constructor(bsq) {
    this.bsq = bsq;
    this.logIdentifier = 'ByteSquash';
    // this.spacer = (text) => text.replace(/^/gm, ' '.repeat(3));
  }
}

module.exports = Log;
