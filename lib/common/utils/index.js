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
    const { path: projectPath, name: projectName } = this.bsq.vars.project;
    const postProjectEndpoint = `${apiBaseUrl}/rest/v1/projects`;
    const bsqConfig = this.bsq.yaml.parse(`${projectPath}/bytesquash.yml`);

    return new Promise((resolve, reject) => {
      this.bsq.cli.log.debug(
        `Retrieve a deployment key for project ${projectName}`
      );

      request.post(
        postProjectEndpoint,
        {
          json: {
            name: projectName,
            type: bsqConfig.type
          }
        },
        (error, res, body) => {
          if (!error && res.statusCode === 200 && body.message === 'success') {
            resolve(body.data.key);
          } else if (body && body.message) {
            reject(body.message);
          } else if (error) {
            reject(error);
          } else {
            reject('Cannot retrieve a deployment key');
          }
        }
      );
    });
  }
}

module.exports = Utilities;
