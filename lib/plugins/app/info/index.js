'use strict';

const colors  = require('colors');

class AppInfo {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    const functionsLen = Object.keys(this.bsq.vars.functions).length;

    return new Promise((resolve) => {
      this.bsq.cli.log.info(
        `App contains "${colors.blue.bold(functionsLen)}" ${functionsLen === 1 ? 'function' : 'functions'}`
      );

      resolve();
    });
  }
}

module.exports = AppInfo;
