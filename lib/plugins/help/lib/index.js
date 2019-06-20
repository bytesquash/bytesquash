'use strict';

const Promise = require('bluebird');

class Help {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      this.bsq.cli.log.console(
        this.bsq.cli.help.get(this.bsq.cli.commands, this.bsq.cli.params.get().args[0])
      );

      resolve();
    });
  }
}

module.exports = Help;
