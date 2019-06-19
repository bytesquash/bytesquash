'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const fsExtra = require('fs-extra');
const path = require('path');
const colors = require('colors');
const Provider = require('provider-node');
const fs = require('fs');

/**
 * Class that represents deployment
 */
class Deploy {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      const { buildPath: projectBuildPath, path: projectPath } = this.bsq.vars.project;
      const mainVarsPath = path.join(projectPath, '.build', '.vars.json');
      const vars = JSON.parse(fs.readFileSync(mainVarsPath, 'utf8'));

      fsExtra.ensureDirSync(path.join(projectBuildPath, 'deploy', 'functions'));

      this.bsq.checksums.compile('cloud', vars.stage).then((checksumData) => {
        this.deployFunctions(vars).then(() => {
          this.bsq.checksums.data.save('cloud', checksumData).then(() => {
            resolve();
          });
        });
      });
    });
  }

  deployFunctions(vars) {
    return new Promise((resolve, reject) => {
      const provider = new Provider(vars).init();

      const { cli } = this.bsq;

      const functions = this.bsq.functions.get();

      this.bsq.provider = provider;

      const functionsLen = _.keys(functions).length;

      if (functionsLen > 0) {
        cli.log.info(
          `"${colors.blue.bold(functionsLen)}" ${functionsLen === 1 ?
            'function' : 'functions'} added for the deployment process`
        );
      }

      if (functionsLen === 0) {
        cli.log.info('No available functions to deploy');
        process.exit(0);
      }

      cli.log.info('Compiling functions');
      cli.loader.start();
      provider.functions.compile(functions).then(() => {
        cli.loader.stop();
        cli.log.info('Packaging functions');
        cli.loader.start();
        provider.functions.package(functions).then(() => {
          cli.loader.stop();
          cli.log.info('Uploading functions');
          cli.loader.start();
          provider.functions.upload(functions).then(() => {
            cli.loader.stop();
            cli.log.info('Deploying functions');
            cli.loader.start();
            provider.functions.deploy(functions).then(() => {
              cli.loader.stop();
              cli.log.info('Deployment succeeded !');

              provider.utils.getAppBaseUrl().then((appBaseUrl) => {
                provider.utils.getStorageBaseUrl().then((storageBaseUrl) => {
                  const validateURL = (val) => {
                    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
                    return urlregex.test(val);
                  };

                  if (!validateURL(appBaseUrl)) {
                    reject(new Error('Can\'t retrieve the app base url'));
                  }

                  if (!validateURL(storageBaseUrl)) {
                    reject(new Error('Can\'t retrieve the storage base url'));
                  }

                  cli.log.info(`App base URL : "${colors.blue.bold(appBaseUrl)}"`);
                  cli.log.info(`Storage base URL : "${colors.blue.bold(storageBaseUrl)}"`);

                  resolve();
                });
              });
            });
          });
        });
      });
    });
  }
}

module.exports = Deploy;
