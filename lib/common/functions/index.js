'use strict';

const _ = require('lodash');
const path = require('path');

class Functions {
  constructor(bsq) {
    this.bsq = bsq;
  }

  add(functionPath, functionService) {
    const options = this.bsq.cli.params.get().options;
    const configFilePath = path.join(functionPath, 'squeezer.yml');
    const functionObject = this.bsq.yaml.parse(configFilePath);
    const functionName = functionObject.name;
    const functionIdentifier = this.bsq.utils.getIdentifier(functionName);
    const functionOpt = options.function || null;

    let flagged = true;
    let force = false;

    if (!functionName) {
      this.bsq.cli.log.error(`Missing function name on ${configFilePath}`);
    }

    if (functionOpt && functionName !== functionOpt) {
      flagged = false;
    }

    if (_.has(options, 'force')) {
      force = true;
    }

    _.assign(functionObject,
      this.constructFunctionObj(functionObject, functionName, functionIdentifier,
        functionService, functionPath, flagged, force));

    if (_.has(this.bsq.vars.functions, functionName)) {
      this.bsq.cli.log.error(`There is a duplicated function with name "${functionName}"`);
    }

    this.bsq.vars.functions[functionObject.name] = functionObject;
  }

  constructFunctionObj(functionObject, functionName, functionIdentifier,
    functionService, functionPath, flagged, force) {
    return {
      name: functionName,
      handler: 'handler',
      timeout: functionObject.timeout || 6,
      memory: functionObject.memory || 128,
      identifier: functionIdentifier,
      service: functionService,
      serviceIdentifier: this.bsq.utils.getIdentifier(functionService),
      path: functionPath,
      packagePath: path.join(this.bsq.vars.project.buildPath, 'deploy', 'functions'),
      packageFile: `${functionIdentifier}.zip`,
      flagged: flagged,
      force: force
    };
  }

  get() {
    return this.bsq.vars.functions;
  }
}

module.exports = Functions;
