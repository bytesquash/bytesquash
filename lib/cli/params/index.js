'use strict';

/**
 * Class for CLI params orchestration
 */
class Params {
  constructor(sqz) {
    this.sqz    = sqz;
    this.params = this.parse(process.argv.slice(2));
  }
}

module.exports = Params;
