'use strict';

const Promise = require('bluebird');
const request = require('request');
const path = require('path');
const colors = require('colors');
const fs = require('fs');
const _ = require('lodash');

class Data {
  constructor(bsq) {
    this.bsq = bsq;
  }

  getKey() {
    const config = this.bsq.config.data;
    const { key } = config;

    return key;
  }

  get(compileType, stage) {
    let checksums = {};

    const { buildPath } = this.bsq.vars.app;

    this.bsq.cli.log.debug('Grabbing previous checksums');

    return new Promise((resolve, reject) => {
      if (compileType === 'development') {
        const checksumFile = path.join(buildPath, 'development', 'checksums.json');

        if (fs.existsSync(checksumFile)) {
          checksums = JSON.parse(fs.readFileSync(checksumFile, 'utf8'));
        }

        resolve(checksums);
      } else if (compileType === 'cloud') {
        const key = this.getKey();
        const { apiBaseUrl } = this.bsq.vars;
        const deployEndpoint = `${apiBaseUrl}/rest/v1/deployment/${key}`;

        if (key) {
          request.get(deployEndpoint, { json: true }, (error, response, body) => {
            const { statusCode } = response;

            if (!error && statusCode === 200 && body.message === 'success') {
              const deployment = _.find(
                body.data.checksums, (val => (val.stage === stage))
              );
              if (deployment) {
                _.assign(checksums, {
                  checksums: [
                    deployment
                  ]
                });
              }

              resolve(checksums);
            } else if (error) {
              reject(new Error(error));
            } else {
              reject(new Error('Cannot get the checksums for current deployment'));
            }
          });
        } else {
          this.bsq.cli.log.warn(
            `By using an empty deployment key you can't take the full advantage of using smart tests, builds & deployments : "${colors.yellow('bsq genkey')}"`
          );
          resolve();
        }
      }
    });
  }

  save(compileType, checksums) {
    this.bsq.cli.log.debug('Saving checksums');

    return new Promise((resolve, reject) => {
      if (compileType === 'development') {
        const checksumFile = path.join(this.bsq.vars.app.buildPath, 'development', 'checksums.json');
        fs.writeFileSync(checksumFile, JSON.stringify(checksums, null, 2), 'utf8');

        resolve();
      } else if (compileType === 'cloud') {
        const key = this.getKey();
        const { apiBaseUrl } = this.bsq.vars;
        const endpoint = `${apiBaseUrl}/rest/v1/deployment/${key}`;

        if (key) {
          request.post(
            endpoint,
            {
              json: checksums
            },
            (error, response, body) => {
              if (!error && response.statusCode === 200 && body.message === 'success') {
                resolve(body);
              } else if (error) {
                reject(new Error(error));
              } else {
                reject(new Error('Cannot save the checksums for current deployment'));
              }
            }
          );
        } else {
          resolve();
        }
      }
    });
  }
}

module.exports = Data;
