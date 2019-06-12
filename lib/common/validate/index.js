'use strict';

const _ = require('lodash');

/**
 * Class that compiles some requirements needed for deployment
 */
class Validate {
  constructor(bsq) {
    this.bsq = bsq;
  }

  stage(stages) {
    const { stage } = this.bsq.vars;

    if (!_.isEmpty(stages)) {
      if (!_.includes(stages, stage)) {
        return false;
      }
    }

    return true;
  }

  platform() {
    const { name: projectRuntime } = this.bsq.vars.project.runtime;

    const versionCheck    = (projectVersion, runtimeVersion) => {
      if (projectVersion !== runtimeVersion) {
        this.bsq.cli.log.warn(
          `"${projectRuntime}" runtime version "${runtimeVersion}" is different from `
          + `the one specified in the project's config "${projectVersion}"`
        );
      }
    };
  }
}

module.exports = Validate;
