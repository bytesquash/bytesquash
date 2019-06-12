'use strict';

const _      = require('lodash');

/**
 * Class that compiles some requirements needed for deployment
 */
class Validate {
  constructor(bsq) {
    this.bsq = bsq;
  }

  stage(stages) {
    const { stage } = this.bsq.vars;

    if (!_.isEmpty(stages)) {
      if (!_.includes(stages, stage)) {
        return false;
      }
    }

    return true;
  }
}

module.exports = Validate;
