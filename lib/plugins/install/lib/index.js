'use strict';

const Promise = require('bluebird');
const request = require('request');

class InstallCMD {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      this.projectInstall().then(() => {
        this.bsq.cli.log.info('Installed !');
        resolve();
      });
    });
  }

  projectInstall() {
    return new Promise((resolve) => {
      const { project } = this.bsq.vars;

    });
  }
}

module.exports = InstallCMD;
