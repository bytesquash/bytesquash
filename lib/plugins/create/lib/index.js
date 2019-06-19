'use strict';

const colors = require('colors');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const path = require('path');
const tar = require('tar');
const request = require('request');
const fs = require('fs');
const fsExtra = require('fs-extra');
const _ = require('lodash');
const Promise = require('bluebird');

/**
 * Class representing project creation .
 */
class CreateCMD {
  constructor(bsq) {
    this.bsq = bsq;
    const options = this.bsq.cli.params.get().options;

  }
}

module.exports = CreateCMD;
