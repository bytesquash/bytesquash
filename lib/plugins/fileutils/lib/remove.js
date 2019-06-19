'use strict';

const fs     = require('fs-extra');

class removeCMD {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      const { options } = this.sqz.cli.params.get();

      fs.removeSync(options.path);

      resolve();
    });
  }
}

module.exports = removeCMD;
