'use strict';

const colors = require('colors');
const _ = require('lodash');

const bin = Object.keys(require('../../../../package.json').bin)[0];

/**
 * Class which builds the help message  .
 */
class Help {
  /**
 * @param {Object} sqz - Squeezer CLI instance
 */
  constructor(bsq) {
    this.bsq = bsq;
  }

    /**
   * Return current version information
   * @returns {Object}
   * @name this.sqz.cli.help.get
   */
  get(commands, param) {
    const cmd        = commands[param];
    const spacer     = ' '.repeat(1);
    const spacerSub  = ' '.repeat(4);
    const desc       = cmd.description || cmd.summary;

    let msg          = '';

  }
}