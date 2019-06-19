'use strict';

const fs      = require('fs');
const fsExtra = require('fs-extra');

class CopyCMD {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      const { options } = this.bsq.cli.params.get();

      if (!fs.existsSync(options.target)) {
        fsExtra.ensureSymlinkSync(options.source, options.target);
      }

      resolve();
    });
  }
}

module.exports = CopyCMD;
