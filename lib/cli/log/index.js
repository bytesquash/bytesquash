'use strict';

const colors = require('colors');
const _ = require('lodash');

/**
 * Class that represents CLI logging.
 */
class Log {
  constructor(bsq) {
    this.bsq = bsq;
    this.logIdentifier = 'ByteSquash';
    // this.spacer = (text) => text.replace(/^/gm, ' '.repeat(3));
  }

  /**
    * Display's a CLI debug message
    * @param {string} msg - debug message
    * @name this.bsq.cli.log.debug
  */
  debug(msg) {
    const params = this.bsq.cli.params.get();


  }
}

module.exports = Log;
