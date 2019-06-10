'use strict';

const Version = require('../../../../lib/common/version');

const colors  = require('colors');
const _       = require('lodash');

/**
 * Class that manage errors of all types.
 */
class Error {
    /**
   * Returns formatted error message
   * @param {string} error - error message
   * @param {boolean} noBsqError - true for system error
   * @returns {String}
   *
   * @name this.bsq.error
   */
  get() {
    let error = errorParam;

    if (_.has(error, 'stack') && noSqzError) error = error.stack;

    const versionInfo = new Version();
    let msg           = colors.red.bold('\n\nBYTESQUASH ERROR:');

    if (noBsqError) {
      msg += `\n\n${error}\n\n`;
    } else {
      msg += `\n\n${error}\n\n`;
    }

    if (noBsqError) {
      msg += `${versionInfo.msg()}\n\n`;
      msg += `Please add ${colors.green('--debug')} to any command for more CLI details\n\n`;
    }
  }
}