'use strict';

const colors = require('colors');
const Promise = require('bluebird');
const _ = require('lodash');

class List {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    this.commands = this.bsq.cli.commands;

    const commands = Object.keys(this.commands);
    let largestCmdLen = 0;
    const singleCommands = [];
    const groupedCommands = {};
    let msg = '';

    commands
      .filter(cmd => this.commands[cmd].summary)
      .sort()
      .map((cmd) => {
        const cmdLen = cmd.length;
        let groupName;

        if (cmdLen > largestCmdLen) largestCmdLen = cmdLen;

        if (cmd.indexOf(':') < 0) {
          singleCommands.push(cmd);
        } else {
          [groupName] = cmd.split(':');

          if (!_.isArray(groupedCommands[groupName])) groupedCommands[groupName] = [];
          groupedCommands[groupName].push(cmd);
        }

        return groupedCommands;
      });

    msg += colors.bold(`\n${' '.repeat(1)}Options:\n\n`);
    msg += `${colors.blue.bold(`${' '.repeat(3)}--debug`)}`
    + `${' '.repeat((largestCmdLen - '--debug'.length) + 1)}add debugging support\n\n`;
    msg += colors.bold(`${' '.repeat(1)}Available commands:\n\n`);

    _.forEach(singleCommands, (cmd) => {
      msg += `${colors.blue.bold(`${' '.repeat(3)}${cmd}${' '.repeat((largestCmdLen - cmd.length) + 1)}`)}`
      + `${this.commands[cmd].summary}\n`;
    });

    _.forEach(groupedCommands, (cmds, group) => {
      msg += colors.bold(`\n${' '.repeat(1)}${group}\n\n`);
      _.forEach(cmds, (key) => {
        msg += `${colors.blue.bold(`${' '.repeat(3)}${key}${' '.repeat((largestCmdLen - key.length) + 1)}`)}`
        + `${this.commands[key].summary}\n`;
      });
    });

    return new Promise((resolve) => {
      this.bsq.cli.log.console(msg);

      resolve();
    });
  }
}

module.exports = List;
