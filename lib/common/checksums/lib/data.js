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
    const key = config.key;

    return key;
  }

  get(compileType, stage) {
    let checksums = {};

    const buildPath = this.bsq.vars.project.buildPath;

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
        const apiBaseUrl = this.bsq.vars.apiBaseUrl;
        const deployEndpoint = `${apiBaseUrl}/rest/v1/deployment/${key}`;

        if (key) {
          request.get(deployEndpoint, { json: true }, (error, response, body) => {
            const statusCode = response.statusCode;

            if (!error && statusCode === 200 && body.message === 'success') {
              const deployment = _.find(
                body.data.checksums, (val => (val.stage === stage))
              );
              if (deployment) {
                _.assign(checksums, {
                  checksums : [
                    deployment
                  ]
                });
              }

              resolve(checksums);
            } else if (body && body.message) {
              reject(body.message);
            } else if (error) {
              reject(error);
            } else {
              reject('Cannot get the checksums for current deployment');
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
      }
    });
  }
}

module.exports = Data;
