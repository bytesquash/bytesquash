'use strict';

const colors  = require('colors');
const Promise = require('bluebird');
const _       = require('lodash');

class List {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    this.commands = this.bsq.cli.commands;

    const commands        = Object.keys(this.commands);
    let largestCmdLen     = 0;
    const singleCommands  = [];
    const groupedCommands = {};
    let msg               = '';

    return new Promise((resolve) => {
    });
  }
}

module.exports = List;
