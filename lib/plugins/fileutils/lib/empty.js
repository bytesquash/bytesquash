'use strict';

const fs     = require('fs-extra');

class emptyDirSyncCMD {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      const  { options } = this.sqz.cli.params.get();

      fs.emptyDirSync(options.dir);

      resolve();
    });
  }
}

module.exports = emptyDirSyncCMD;
