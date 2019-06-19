'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const fsExtra = require('fs-extra');
const path = require('path');
const colors = require('colors');
const Provider = require('provider-node');
const fs = require('fs');

/**
 * Class that represents deployment
 */
class Deploy {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {

    });
  }
}

module.exports = Deploy;
