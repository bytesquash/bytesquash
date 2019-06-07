/**
 * CLI manager
 */

const bsq = require('./ByteSquash');
const path = require('path');
const colors = require('colors/safe');
const _ = require('lodash');
const walkSync = require('walk-sync');

const settings = require('../package.json');

const bin = Object.keys(settings.bin)[0];

/* eslint no-param-reassign: 0, no-shadow: 0, prefer-template : 0 */

module.exports = (() => {
  'use strict';

  class CommandLineInterface {
    constructor() {
      this.args = bsq.cli.params.get();
      this.commands = {};
    }

    load() {
      const frameworkPath = path.resolve(`${__dirname}/../lib`);
      const frameworkCmdsPaths = walkSync(path.resolve(`${__dirname}/../lib`), { globs: ['plugins/*/index.js'] })
        .map(val => ({ path: path.join(frameworkPath, val) }));

      let pluginsCmdsPaths = [];

      if (bsq.vars.project.isValid && bsq.vars.customPluginPaths.length > 0) {
        pluginsCmdsPaths = _.concat(pluginsCmdsPaths, bsq.vars.customPluginPaths);
      }

      const paths = _.concat(frameworkCmdsPaths, pluginsCmdsPaths);

      _.forEach(paths, (val) => {
        this.add(require(val.path), val.path); // eslint-disable-line global-require
      });
    }

    add(CommandConstructor, path, options) {
      const command = new CommandConstructor(bsq, options);

      if (!_.has(command, 'commands')) {
        bsq.cli.log.error(`No available command constructor found in "${path}"`);
      }

      command.commands.forEach((cmdObj) => {
        if (_.has(this.commands, cmd)) {
          
        } else {
          this.commands[cmd] = cmdObj;
        }
      });
    }
  }

  return CommandLineInterface;
})();
