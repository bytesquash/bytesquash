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
    const { path: projectPath } = this.bsq.vars.project;
    const functionOpt = this.bsq.cli.params.get().options.function || null;

    const walkService = (service) => {
      const servicePath = path.join(projectPath, 'services', service);

      fs.readdirSync(servicePath).forEach((functionDir) => {
        const functionPath = path.join(servicePath, functionDir);
        this.bsq.functions.add(functionPath, service);
      });
    };

    const servicesPath = path.join(projectPath, 'services');
    fs.readdirSync(servicesPath).forEach((service) => {
      walkService(service);
    });

    if (functionOpt && !_.has(this.bsq.vars.functions, functionOpt)) {
      this.bsq.cli.log.error(`There is no any function "${functionOpt}" available`);
    }

    if (_.isEmpty(this.bsq.vars.functions)) {
      this.bsq.cli.log.error(
        'This project has no functions to process'
      );
    }
  }
}

module.exports = loadFunctions;
