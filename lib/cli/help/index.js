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
  constructor(sqz) {
    this.sqz = sqz;
  }

}