'use strict';

const cfg = require('home-config').load('.bsqrc');
const _ = require('lodash');

/**
 * Class that manages app's configuration
 */
class Config {
  constructor(bsq) {
    this.bsq = bsq;
    this.data = cfg.getAll();

    this.data = {};

    const data = cfg.getAll();

    const appName = this.bsq.vars.app.name;

    if (_.has(data, appName)) {
      this.data = data[appName];
    }
  }

  /**
   * Configure a setting
   *
   * @param {string} setting - setting name
   * @param {string} setting - setting value
   *
   * @name this.bsq.config.set
   */
  set(setting, value) {
    const data = cfg.getAll();

    if (!_.has(data, this.bsq.vars.app.name)) {
      cfg[this.bsq.vars.app.name] = {};
    }

    cfg[this.bsq.vars.app.name][setting] = value;

    cfg.save();
  }

  /**
   * Retrieve a setting
   *
   * @param {string} setting - setting name
   *
   * @returns {Object}
   *
   * @name this.bsq.config.get
   */
  get(setting) {
    return this.data[setting];
  }
}

module.exports = Config;
