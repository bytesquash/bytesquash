'use strict';

const cfg = require('home-config').load('.bsqrc');
const _ = require('lodash');

/**
 * Class that manages project's configuration
 */
class Config {
  constructor(bsq) {
    this.bsq = bsq;
    this.data = cfg.getAll();

    this.data = {};

    const data = cfg.getAll();

    const projectName = this.bsq.vars.project.name;

    if (_.has(data, projectName)) {
      this.data = data[projectName];
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

  }
}

module.exports = Config;
