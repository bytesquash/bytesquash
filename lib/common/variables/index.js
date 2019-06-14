'use strict';

class Variables {
  constructor(bsq) {
    this.bsq = bsq;
  }

  /**
   * Returns all available variables
   *
   * @Return {String} variables - all variables
   * @name this.sqz.variables.get
   */
  get() {
    return this.bsq.vars;
  }
}

module.exports = Variables;
