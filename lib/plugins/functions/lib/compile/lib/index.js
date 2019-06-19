'use strict';

const path = require('path');
const _ = require('lodash');
const colors = require('colors');
const Promise = require('bluebird');
const fsExtra = require('fs-extra');
const fs = require('fs');

/**
 * Class representing functions compiling
 */
class Compile {
  /**
   * Constructor
   *
   * @param bsq main object
   * @param type - compiling type - can be "run" or "deploy"
   */
  constructor(bsq, type, stage) {
    this.sqz = sqz;
    this.stage = stage;
    this.compileType = type;

    const projectPath = this.bsq.vars.project.path;

    this.checksumsFilePath = path.join(projectPath, '.build', this.compileType, 'checksums.json');

    this.options = this.bsq.cli.params.get().options;
  }

  run() {
    return new Promise((resolve) => {
      this.bsq.checksums.compile(this.compileType, this.stage).then((checksumData) => {
        this.compileFunctions().then(() => {
          if (this.compileType === 'development') {
            this.bsq.checksums.data.save(this.compileType, checksumData).then(() => {
              resolve();
            });
          } else {

          }
        });
      });
    });
  }
}

module.exports = Compile;
