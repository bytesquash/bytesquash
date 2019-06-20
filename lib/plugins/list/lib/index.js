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
          groupName = cmd.split(':')[0];

          if (!_.isArray(groupedCommands[groupName])) groupedCommands[groupName] = [];
          groupedCommands[groupName].push(cmd);
        }

        return groupedCommands;
      });

      
    return new Promise((resolve) => {
    });
  }
}

module.exports = List;
