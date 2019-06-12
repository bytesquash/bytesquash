'use strict';

const _ = require('lodash');
const request = require('request');

/**
 * Class that manages some ByteSquash utilities
 */
class Utilities {
  constructor(bsq) {
    this.bsq = bsq;
  }

  getIdentifier(value) {
    return _.upperFirst(_.camelCase(value));
  }

  getDeploymentKey() {
  }
}

module.exports = Utilities;
