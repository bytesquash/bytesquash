'use strict';

const Promise = require('bluebird');
const request = require('request');

class InstallCMD {
  constructor(bsq) {
    this.bsq = bsq;
  }
}

module.exports = InstallCMD;
