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
    const { path: appPath, name: appName } = this.bsq.vars.app;
    const postAppEndpoint = `${apiBaseUrl}/rest/v1/apps`;
    const bsqConfig = this.bsq.yaml.parse(`${appPath}/bytesquash.yml`);

    return new Promise((resolve, reject) => {
      this.bsq.cli.log.debug(
        `Retrieve a deployment key for app ${appName}`
      );

      request.post(
        postAppEndpoint,
        {
          json: {
            name: appName,
            type: bsqConfig.type
          }
        },
        (error, res, body) => {
          if (!error && res.statusCode === 200 && body.message === 'success') {
            resolve(body.data.key);
          } else if (error) {
            reject(new Error(error));
          } else {
            reject(new Error('Cannot retrieve a deployment key'));
          }
        }
      );
    });
  }
}

module.exports = Utilities;
