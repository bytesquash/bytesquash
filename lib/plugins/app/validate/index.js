'use strict';

class App {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      this.bsq.cli.log.debug('Checking if the current directory it\'s a valid Byte Squash application');

      if (!this.bsq.vars.app.isValid) {
        this.bsq.cli.log.error('This is not a valid app directory');
      }

      resolve();
    });
  }
}

module.exports = App;
