'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const CompileFunctions = require('../../functions/lib/compile');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const Provider = require('bytesquash-provider');

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
      fsExtra.ensureDirSync(path.join(this.bsq.vars.project.path, '.build', compileType));

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
    const { vars: projectVars, path: projectPath } = this.bsq.vars.project;
    const config = this.bsq.config.data;
    const mainVarsPath = path.join(projectPath, '.build', '.vars.json');

    let vars = {
      name: this.bsq.vars.project.name,
      path: this.bsq.vars.project.path,
      identifier: this.bsq.vars.project.identifier,
      stage: stage,
      config: this.bsq.config.data,
      provider: compileType === 'development' ? 'local' : config.provider,
      runtime: this.bsq.vars.project.runtime,
      runtimeVersion: this.bsq.vars.project.runtimeVersion
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

      vars = _.merge(vars, _.omit(projectVars, ['stages']));
      vars = _.merge(vars, projectVars.stages[stage]);

      fs.writeFileSync(mainVarsPath, JSON.stringify(vars, null, 2));

      resolve(vars);
    });

    buildFunctionsVars(vars) {
      const functions = this.bsq.vars.functions;

    }
  }
}

module.exports = Compile;
