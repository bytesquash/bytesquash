'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const Provider = require('bytesquash-provider');
const CompileFunctions = require('../../functions/lib/compile');


class Compile {
  constructor(bsq) {
    this.bsq = bsq;
    this.options = this.bsq.cli.params.get().options;
  }

  run() {
    const compileFunctions = new CompileFunctions(this.bsq);
    let compileType = 'development' || this.options.cloud;
    let stage = this.options.stage || 'local';

    if (_.has(this.options, 'cloud')) {
      compileType = 'cloud';

      if (stage === 'local') {
        stage = 'dev';
      }
    }

    return new Promise((resolve) => {
      fsExtra.ensureDirSync(path.join(this.bsq.vars.app.path, '.build', compileType));

      this.bsq.cli.log.debug('Building staging vars');
      this.buildMainVars(stage, compileType).then((mainVars) => {
        this.buildFunctionsVars(mainVars);

        compileFunctions.compile(compileType, stage).then(() => {
          this.bsq.cli.log.info('Compiled !');
          resolve();
        });
      });
    });
  }

  vars() {
    return new Promise((resolve) => {
      this.buildMainVars('local', 'development').then((mainVars) => {
        this.buildFunctionsVars(mainVars);
        resolve();
      });
    });
  }

  buildMainVars(stage, compileType) {
    const { vars: appVars, path: appPath } = this.bsq.vars.app;
    const config = this.bsq.config.data;
    const mainVarsPath = path.join(appPath, '.build', '.vars.json');

    let vars = {
      name: this.bsq.vars.app.name,
      path: this.bsq.vars.app.path,
      identifier: this.bsq.vars.app.identifier,
      stage: stage,
      config: this.bsq.config.data,
      provider: compileType === 'development' ? 'local' : config.provider,
      runtime: this.bsq.vars.app.runtime,
      runtimeVersion: this.bsq.vars.app.runtimeVersion
    };


    const buildVolatileVars = () => {
      const volatileVars = {};

      return new Promise((volatileResolve) => {
        if (compileType === 'development') {
          _.assign(volatileVars, {
            appBaseUrl: 'http://localhost:4001',
            storageBaseUrl: 'http://localhost:4001/.build'
          });

          volatileResolve(volatileVars);
        } else if (compileType === 'cloud') {
          const provider = new Provider(vars).init();

          this.bsq.cli.log.info('Deploying cloud base resources');
          this.bsq.cli.loader.start();
          provider.utils.deployBaseResources().then(() => {
            this.bsq.cli.loader.stop();
            provider.utils.getAppBaseUrl().then((appBaseUrl) => {
              provider.utils.getStorageBaseUrl().then((storageBaseUrl) => {
                _.assign(volatileVars, {
                  appBaseUrl: appBaseUrl,
                  storageBaseUrl: storageBaseUrl
                });
                volatileResolve(volatileVars);
              });
            });
          });
        }
      });
    };

    buildVolatileVars().then((volatileVars) => {
      _.assign(vars, volatileVars);

      vars = _.merge(vars, _.omit(appVars, ['stages']));
      vars = _.merge(vars, appVars.stages[stage]);

      fs.writeFileSync(mainVarsPath, JSON.stringify(vars, null, 2));

      resolve(vars);
    });
  }

  buildFunctionsVars(vars) {
    const { functions } = this.bsq.vars;

    _.forEach(functions, (functionObject) => {
      const funcVars = _.assign(vars, {
        function: functionObject
      });

      fs.writeFileSync(
        path.join(functionObject.path, 'src', '.vars.json'),
        JSON.stringify(funcVars, null, 2)
      );
    });
  }
}

module.exports = Compile;
