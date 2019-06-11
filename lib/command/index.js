'use strict';

const child   = require('child_process');
const Promise = require('bluebird');
const path    = require('path');
const colors  = require('colors');

/**
 * Class for running spawning commands
 */
class Command {
  constructor(bsq) {
    this.bsq = bsq;
  }

  /**
   *
   * @param bin
   * @param args
   */
  run(description, bin, args, noExit) {
    return new Promise((resolve, reject) => {
      const normalizedBin = path.normalize(bin);
      this.bsq.cli.log.info(`Executing command: "${colors.blue.bold(description)}"`);
      process.stdout.write(`\n$ ${normalizedBin} ${args.join(' ')}\n`);

      process.stdout.write('\n');

      const exec = child.spawn(normalizedBin, args, {
        shell  : true,
        stderr : 'inherit',
        stdio  : 'inherit',
        stdin  : 'inherit'
      });

      exec.on('close', (code) => {
        if (code !== 0 && !noExit && !process.env.noExit) {
          reject(new Error(`command exit code ${code}`));
        } else {
          process.stdout.write('\n');
          resolve(code);
        }
      });
    });
  }

  bulk(commands) {
    return new Promise((resolve) => {
      Promise.each(Object.keys(commands), (key) => {

      }).then(() => {
      });
    });
  }
}

module.exports = Command;
