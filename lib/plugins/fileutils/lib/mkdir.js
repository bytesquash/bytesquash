'use strict';

const fs     = require('fs-extra');

class mkdirCMD {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      const options = this.sqz.cli.params.get();

      fs.ensureDir(options.dir);

      resolve();
    });
  }
}

module.exports = mkdirCMD;
