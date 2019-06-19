'use strict';

const fs = require('fs-extra');
const _  = require('lodash');

class CopyCMD {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      const { options } = this.sqz.cli.params.get();

      
    });
  }
}

module.exports = CopyCMD;
