'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const CompileFunctions = require('../../functions/lib/compile');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const Provider = require('bytesquash-provider');

class Compile {
  constructor(bsq) {
    this.sqz = bsq;
    this.options = this.bsq.cli.params.get().options;
  }
}

module.exports = Compile;
