'use strict';

const fs     = require('fs-extra');

class MoveCMD {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve, reject) => {
      const { options } = this.bsq.cli.params.get();

      fs.move(options.source, options.target, (err) => {
        if (err) reject(err);

        resolve();
      });
    });
  }
}

module.exports = MoveCMD;
