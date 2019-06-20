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
}

module.exports = InstallCMD;
