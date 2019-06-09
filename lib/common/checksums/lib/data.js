'use strict';

const Promise = require('bluebird');
const request = require('request');
const path = require('path');
const colors = require('colors');
const fs = require('fs');
const _ = require('lodash');

class Data {
  constructor(sqz) {
    this.sqz = sqz;
  }

  getKey() {
    const config = this.sqz.config.data;
    const key = config.key;

    return key;
  }

  get(compileType, stage) {
    let checksums = {};

    const buildPath = this.sqz.vars.project.buildPath;

    this.sqz.cli.log.debug('Grabbing previous checksums');

    return new Promise((resolve, reject) => {
      if (compileType === 'development') {
        const checksumFile = path.join(buildPath, 'development', 'checksums.json');

        if (fs.existsSync(checksumFile)) {
          checksums = JSON.parse(fs.readFileSync(checksumFile, 'utf8'));
        }

        resolve(checksums);
      } else if (compileType === 'cloud') {
        const key = this.getKey();
        const apiBaseUrl = this.sqz.vars.apiBaseUrl;
        const deployEndpoint = `${apiBaseUrl}/rest/v1/deployment/${key}`;

        if (key) {
          request.get(deployEndpoint, { json: true }, (error, response, body) => {
            const statusCode = response.statusCode;

          });
        }
      }
    });
  }
}

module.exports = Data;
