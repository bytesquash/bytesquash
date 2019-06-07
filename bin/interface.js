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
          if (_.has(cmdObj, 'lifecycle')) {
            this.commands[cmd].lifecycle = _.concat(this.commands[cmd].lifecycle, cmdObj.lifecycle);
          }

          if (_.has(cmdObj, 'options')) {
            _.assign(this.commands[cmd].options, cmdObj.options);
          }
        } else {
          this.commands[cmd] = cmdObj;
        }
      });
    }

    get() {
      return this.commands;
    }

    format(names) {
      return names.join(':');
    }

    validate(cmdData) {
      const args = this.args;

      if (!cmdData) return args;

      const helpCmdMsg = colors.yellow(`\n\n$ ${bin} ${colors.blue.bold('help')} ${args.names.join(':')}`);

      const check = (value, key) => {
        if (value.required === true) {
          if (!_.has(args.options, key) && !_.has(args.flags, value.flag)) {
            bsq.cli.log.error(`Missing option ${colors.green(`--${key}`)}  ${helpCmdMsg}`);
          } else if (!args.options[key] && !args.flags[value.flag]) {
            bsq.cli.log.error(`Missing option ${colors.green(`--${key}`)} ` +
              `${colors.red('value')} ${helpCmdMsg}`);
          }
        } else if (!args.options[key] && value.defaultValue !== null) {
          args.options[key] = value.defaultValue;
        }
      };

      _.forEach(cmdData.options, (value, key) => {
        if (_.has(args.flags, value.flag)) {
          sqz.cli.params.setOption(key, args.flags[value.flag]);
        }
        if (value.boolean && args.options[key]) {
          args.options[key] = JSON.parse(args.options[key]);
        }
        if (_.has(value, 'validate')) {
          if (!value.validate.fn(args.options[key])) {
            sqz.cli.log.error(`${colors.blue.bold(`--${key}`)} : ${value.validate.error}`);
          }
        }
        check(value, key);
      });
    }

    index(args, logo) {
      if (args.names.length === 0) {
        const msg =
          `${colors.blue.bold(logo)}\n` +
          `* List commands: ${colors.blue.bold('bsq list')}\n` +
          `* Help: ${colors.blue.bold('bsq help [command]')}\n` +
          '* Docs: docs.bytesquash.com\n' +

      }
    }
  }

  return CommandLineInterface;
})();
