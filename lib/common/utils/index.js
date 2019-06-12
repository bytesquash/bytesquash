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
    const { path: projectPath, name: projectName } = this.sqz.vars.project;
    const postProjectEndpoint = `${apiBaseUrl}/rest/v1/projects`;
    const bytesquashConfig = this.sqz.yaml.parse(`${projectPath}/bytesquash.yml`);

    return new Promise((resolve, reject) => {
      this.bsq.cli.log.debug(
        `Retrieve a deployment key for project ${projectName}`
      );
    });
  }
}

module.exports = Utilities;
