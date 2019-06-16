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
    this.bsq = bsq;
    this.options = this.bsq.cli.params.get().options;
  }

  run() {
    const compileFunctions = new CompileFunctions(this.sqz);
    let compileType = 'development' || this.options.cloud;
    let stage = this.options.stage || 'local';

    if (_.has(this.options, 'cloud')) {
      compileType = 'cloud';

      if (stage === 'local') {
        stage = 'dev';
      }
    }

    return new Promise((resolve) => {
      fsExtra.ensureDirSync(path.join(this.bsq.vars.project.path, '.build', compileType));

    });
  }
}

module.exports = Compile;
