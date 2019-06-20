'use strict';

class Variables {
  constructor(bsq) {
    this.bsq = bsq;
  }

  /**
   * Returns all available variables
   *
   * @Return {String} variables - all variables
   * @name this.bsq.variables.get
   */
  get() {
    return this.bsq.vars;
  }

  /**
   * Returns current selected stage
   *
   * @Return {String} stage - stage value
   * @name this.bsq.variables.getStage
   */
  getStage() {
    return this.bsq.vars.stage;
  }

  /**
   * Returns current selected region
   *
   * @Return {String} region - region value
   * @name this.bsq.variables.getRegion
   */
  getRegion() {
    return this.bsq.vars.region;
  }

  /**
   * Returns app config variables
   *
   * @Return {Object} app - app data
   * @name this.bsq.variables.app
   */
  getApp() {
    return this.bsq.vars.app;
  }

  /**
   * Returns app's hooks
   *
   * @Return {Object} hooks - hooks data
   * @name this.bsq.variables.getHooks
   */
  getHooks() {
    return this.bsq.vars.hooks;
  }
}

module.exports = Variables;
