'use strict';

const _ = require('lodash');
const request = require('request');

/**
 * Class that manages some ByteSquash utilities
 */
class Utilities {
  constructor(bsq) {
    this.bsq = bsq;
  }

  getIdentifier(value) {
    return _.upperFirst(_.camelCase(value));
  }

  getDeploymentKey() {
    return new Promise((resolve, reject) => {
      const { path: projectPath, name: projectName } = this.sqz.vars.project;
      const postProjectEndpoint = `${apiBaseUrl}/rest/v1/projects`;

    });
  }
}

module.exports = Utilities;
