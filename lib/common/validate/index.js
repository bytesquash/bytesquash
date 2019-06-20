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
    const { name: appRuntime } = this.bsq.vars.app.runtime;

    const versionCheck    = (appVersion, runtimeVersion) => {
      if (appVersion !== runtimeVersion) {
        this.bsq.cli.log.warn(
          `"${appRuntime}" runtime version "${runtimeVersion}" is different from `
          + `the one specified in the app's config "${appVersion}"`
        );
      }
    };

    const types = {
      nodejs : {
        fn : () => {
          const appVersionSplit = this.bsq.vars.app.runtime.version.toString().replace(/[^0-9.]/gi, '').split('.');
          const appVersion = `${appVersionSplit[0]}.${appVersionSplit[1]}`;
          const runtimeVersionSplit = process.version.toString().replace(/[^0-9.]/gi, '').split('.');
          const runtimeVersion = `${runtimeVersionSplit[0]}.${runtimeVersionSplit[1]}`;

          versionCheck(appVersion, runtimeVersion);
        }
      }
    };
    types[appRuntime].fn();
  }
}

module.exports = Validate;
