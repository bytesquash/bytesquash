/**
 * CLI manager
 */

const path = require('path');
const colors = require('colors/safe');
const _ = require('lodash');
const walkSync = require('walk-sync');
const bsq = require('./ByteSquash');

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

      if (bsq.vars.app.isValid && bsq.vars.customPluginPaths.length > 0) {
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
        const cmd = cmdObj.arg.join(':');

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
      const { args } = this;

      if (!cmdData) return args;

      const helpCmdMsg = colors.yellow(`\n\n$ ${bin} ${colors.blue.bold('help')} ${args.names.join(':')}`);

      const checkErrors = (value, key) => {
        if (!_.has(args.options, key) && !_.has(args.flags, value.flag)) {
          bsq.cli.log.error(`Missing option ${colors.green(`--${key}`)}  ${helpCmdMsg}`);
        } else if (!args.options[key] && !args.flags[value.flag]) {
          bsq.cli.log.error(`Missing option ${colors.green(`--${key}`)} `
            + `${colors.red('value')} ${helpCmdMsg}`);
        }
      };

      const check = (value, key) => {
        if (value.required === true) {
          checkErrors(value, key);
        } else if (!args.options[key] && value.defaultValue !== null) {
          args.options[key] = value.defaultValue;
        }
      };

      _.forEach(cmdData.options, (value, key) => {
        if (_.has(args.flags, value.flag)) {
          bsq.cli.params.setOption(key, args.flags[value.flag]);
        }
        if (value.boolean && args.options[key]) {
          args.options[key] = JSON.parse(args.options[key]);
        }
        if (_.has(value, 'validate')) {
          if (!value.validate.fn(args.options[key])) {
            bsq.cli.log.error(`${colors.blue.bold(`--${key}`)} : ${value.validate.error}`);
          }
        }
        check(value, key);
      });
    }

    index(args, logo, cliVersion) {
      if (args.names.length === 0) {
        const msg = `${colors.blue.bold(logo)}\n`
          + `\n${cliVersion}\n\n`
          + `* List commands: ${colors.blue.bold('bsq list')}\n`
          + `* Help: ${colors.blue.bold('bsq help [command]')}\n`
          + '* Docs: docs.bytesquash.com\n'
          + '* Chat: chat.bytesquash.com\n'
          + '* Bugs: github.com/ByteSquash/bytesquash/issues\n\n'
          + `* For debugging add ${colors.blue.bold('--debug')} flag\n`;

        bsq.cli.log.console(msg.replace(/^/gm, ' '.repeat(1)));

        process.exit(0);
      }
    }

    run() {
      const { args } = this;
      const command = this.commands[args.names.join(':')];
      const hintCmd = args.names[0] === 'help' ? args.args[0] : args.names.join(':');
      const cliVersion = `Framework Version ${colors.blue.bold(`${settings.version}`)}`;

      /**
       * ascii art generated with the help of :
       * http://patorjk.com/software/taag/#p=display&f=Chunky&t=Byte%20Squash
       */
      let logo = '';
      logo = `${logo}                                 \n`;
      logo = `${logo} ______         __              _______                           __    \n`;
      logo = `${logo}|   __ \\.--.--.|  |_.-----.    |     __|.-----.--.--.---.-.-----.|  |--.\n`;
      logo = `${logo}|   __ <|  |  ||   _|  -__|    |__     ||  _  |  |  |  _  |__ --||     |\n`;
      logo = `${logo}|______/|___  ||____|_____|    |_______||__   |_____|___._|_____||__|__|\n`;
      logo = `${logo}        |_____|                            |__|             \n`;

      this.display(logo, command, hintCmd, cliVersion, args);
    }

    display(logo, command, hintCmd, cliVersion, args) {
      let errorMsg = `Command "${colors.green(hintCmd)}" not found  ... \n`;
      const availableHelpCmds = [];

      this.index(args, logo, cliVersion);

      if (args.names[0] === 'help' && args.args.length === 0) {
        bsq.cli.log.error(
          'Missing help command argument , please use '
          + `${colors.blue.bold(`\`${bin} help [command]\``)}`
          + `\n\n... or ${colors.blue.bold(`\`${bin} list\``)} to get all available commands\n`
        );
      }

      if (!this.commands[hintCmd] || !command) {
        Object.keys(this.commands).map((cmd) => {
          if (cmd.indexOf(hintCmd) >= 0) {
            availableHelpCmds.push(cmd);
          }
          return availableHelpCmds;
        });

        if (availableHelpCmds.length > 0) {
          errorMsg += colors.green('\nDid you mean one of these commands?\n\n');
          errorMsg += `${' '.repeat(3)}${colors.blue.bold(availableHelpCmds.join(`\n${' '.repeat(3)}`))}`;
        }

        bsq.cli.log.error(errorMsg);
      }

      this.validate(command);

      bsq.cli.commands = this.commands;

      bsq.lifecycle.run(command.lifecycle);
    }
  }

  return CommandLineInterface;
})();
