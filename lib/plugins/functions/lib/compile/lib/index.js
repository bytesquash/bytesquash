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
    this.bsq = bsq;
    this.stage = stage;
    this.compileType = type;

    const appPath = this.bsq.vars.app.path;

    this.checksumsFilePath = path.join(appPath, '.build', this.compileType, 'checksums.json');

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
      const { functions } = this.bsq.vars;

      Promise.each(Object.keys(functions), (key) => {
        if ((functions[key].flagged && functions[key].changed)
          || (functions[key].flagged && functions[key].force)) {
          return this.compileFunction(functions[key]);
        }
      }).then(() => {
        resolve();
      });
    });
  }

  compileFunction(functionObject) {
    return new Promise((resolve) => {
      const appPath = path.normalize(this.bsq.vars.app.path);
      const { runtime: appRuntime } = this.bsq.vars.app;
      const source = path.join(functionObject.path, 'src');
      const output = path.join(appPath, '.build', this.compileType, 'functions', functionObject.identifier);

      fsExtra.emptyDirSync(output);
      fsExtra.ensureDirSync(output);

      let compileCmds = [];

      const options = {
        app: this.bsq.vars.app,
        func: functionObject,
        source: source,
        output: output
      };

      const functionHook = path.join(appPath, 'lib', 'hooks', 'commands', 'compile', this.compileType, 'function.yml');

      compileCmds = _.concat(
        compileCmds,
        this.bsq.yaml.parse(functionHook, options)
      );

      if (this.compileType === 'cloud') {
        const treeData = JSON.parse(fs.readFileSync(path.join(appPath, '.build', 'tree.json')));

        if (appRuntime === 'nodejs') {
          const packagesData = {
            license: 'UNLICENSED',
            dependencies: {
              'source-map-support': '^0.4.18'
            }
          };

          _.forEach(treeData.functions[functionObject.name].packages, (obj) => {
            packagesData.dependencies[obj.pkg] = obj.version;
          });

          fs.writeFileSync(path.join(output, 'package.json'), JSON.stringify(packagesData, null, 2));
        }

        const functionPackagesHook = path.join(appPath, 'lib', 'hooks', 'commands', 'compile', this.compileType, 'package.yml');

        compileCmds = _.concat(
          compileCmds,
          this.bsq.yaml.parse(functionPackagesHook, options)
        );
      }

      if (!_.isEmpty(compileCmds)) {
        this.bsq.cli.log.info(`Compiling function "${colors.blue.bold(functionObject.name)}"`);
      }

      Promise.each(Object.keys(compileCmds), (key) => {
        const command = compileCmds[key];

        return this.bsq.command.run(command.description, command.bin, command.args || []);
      }).then(() => {
        if (functionObject.packaging) {
          this.bsq.cli.log.debug(`Adding packages to function ${colors.blue.bold(functionObject.name)}`);

          _.forEach(functionObject.packaging, (pkg) => {
            const src = path.join(functionObject.path, 'src', pkg);
            const dest = path.join(output, pkg);

            if (fs.existsSync(src) && !fs.existsSync(dest)) {
              if (this.compileType === 'cloud') {
                fsExtra.copySync(src, dest);
              } else {
                fsExtra.ensureSymlinkSync(src, dest);
              }
            }
          });
        }

        resolve();
      });
    });
  }
}

module.exports = Compile;
