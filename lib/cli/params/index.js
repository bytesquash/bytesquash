'use strict';

/**
 * Class for CLI params orchestration
 */
class Params {
  constructor(bsq) {
    this.bsq    = bsq;
    this.params = this.parse(process.argv.slice(2));
  }

  /**
   * Set CLI params object
   * @name this.bsq.cli.params.set
   */
  set(params) {
    this.params = params;
  }
}

module.exports = Params;
