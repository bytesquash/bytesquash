'use strict';

const colors = require('colors');
const Promise = require('bluebird');

/**
 * Class manages Apps config .
 */
class Config {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    const params = this.bsq.cli.params.get();

    return new Promise(() => {
      this.bsq.cli.log.info(`Configuring "${colors.blue.bold(params.options.setting)}"`);

      this.bsq.config.set(params.options.setting, params.options.value);

      this.bsq.cli.log.info('Done !');
    });
  }
}

module.exports = Config;
