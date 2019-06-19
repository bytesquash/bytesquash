'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');

/**
 * Loads available functions from the current project
 */
class loadFunctions {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      this.bsq.vars.functions = {};

      this.load();

      resolve();
    });
  }

  load() {
    const { path: projectPath } = this.sqz.vars.project;
    const functionOpt = this.sqz.cli.params.get().options.function || null;

    const walkService = (service) => {
      const servicePath = path.join(projectPath, 'services', service);

      fs.readdirSync(servicePath).forEach((functionDir) => {
        const functionPath = path.join(servicePath, functionDir);
        this.sqz.functions.add(functionPath, service);
      });
    };
  }
}

module.exports = loadFunctions;
