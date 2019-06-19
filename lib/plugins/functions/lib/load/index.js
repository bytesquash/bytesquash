'use strict';

const _      = require('lodash');
const path   = require('path');
const fs     = require('fs');

/**
 * Loads available functions from the current project
 */
class loadFunctions {
  constructor(bsq) {
    this.bsq = bsq;
  }
}

module.exports = loadFunctions;
