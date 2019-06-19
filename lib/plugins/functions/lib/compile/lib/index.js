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
            resolve();
          }
        });
      });
    });
  }

  compileFunctions() {
    return new Promise((resolve) => {
      const { functions } = this.sqz.vars;

      Promise.each(Object.keys(functions), (key) => {
        if ((functions[key].flagged && functions[key].changed) ||
          (functions[key].flagged && functions[key].force)) {
          return this.compileFunction(functions[key]);
        }
      }).then(() => {
        resolve();
      });
    });
  }

  compileFunction(functionObject) {
    return new Promise((resolve) => {
      const projectPath = path.normalize(this.sqz.vars.project.path);
      const { runtime: projectRuntime } = this.sqz.vars.project;
      const source = path.join(functionObject.path, 'src');
      const output = path.join(projectPath, '.build', this.compileType, 'functions', functionObject.identifier);
    });
  }
}

module.exports = Compile;
