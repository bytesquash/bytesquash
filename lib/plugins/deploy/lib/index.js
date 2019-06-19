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
      const { buildPath: projectBuildPath, path: projectPath } = this.bsq.vars.project;
      const mainVarsPath = path.join(projectPath, '.build', '.vars.json');
      const vars = JSON.parse(fs.readFileSync(mainVarsPath, 'utf8'));

      fsExtra.ensureDirSync(path.join(projectBuildPath, 'deploy', 'functions'));

      this.bsq.checksums.compile('cloud', vars.stage).then((checksumData) => {
        this.deployFunctions(vars).then(() => {
          this.bsq.checksums.data.save('cloud', checksumData).then(() => {
            resolve();
          });
        });
      });
    });
  }

  deployFunctions(vars) {
    return new Promise((resolve, reject) => {
      const provider = new Provider(vars).init();

      const cli = this.bsq.cli;

      const functions = this.bsq.functions.get();

      this.bsq.provider = provider;

    });
  }
}

module.exports = Deploy;
