'use strict';

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const _ = require('lodash');
const walkSync = require('walk-sync');
const Deps = require('./lib/deps');
const Data = require('./lib/data');
const Promise = require('bluebird');

class Checksums {
  constructor(bsq) {
    this.bsq = bsq;
    this.deps = new Deps(this.bsq);
    this.data = new Data(this.bsq);
  }

  compile(compileType, stage) {
    this.treeFile = path.join(this.bsq.vars.project.path, '.build', 'tree.json');

    if (!this.tree) {
      if (fs.existsSync(this.treeFile)) {
        this.tree = JSON.parse(fs.readFileSync(this.treeFile, 'utf8'));
      } else {
        this.tree = {
          files: {},
          functions: {}
        };
      }
    }

    return new Promise((resolve) => {
      const functions = this.bsq.vars.functions;

      const data = {
        checksums: [
          {
            stage: stage,
            functions: []
          }
        ]
      };

      this.data.get(compileType, stage).then((previousChecksumData) => {
        this.bsq.cli.log.debug('Calculating functions checksums');

        _.forEach(functions, (functionObject) => {
          let previousChecksum = null;
          const checksum = this.check(functionObject);

          const functionName = functionObject.name;

        });
      });
    });
  }
}

module.exports;
