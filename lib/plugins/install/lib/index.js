'use strict';

const Promise = require('bluebird');
const request = require('request');

class InstallCMD {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      this.appInstall().then(() => {
        this.bsq.cli.log.info('Installed !');
        resolve();
      });
    });
  }

  appInstall() {
    return new Promise((resolve) => {
      const { app } = this.bsq.vars;
      const installCmds = this.bsq.yaml.parse(
        `${app.path}/lib/hooks/commands/install/app.yml`,
        {
          app: this.bsq.vars.app,
          sudo: process.platform === 'win32' ? '' : 'sudo'
        }
      );

      this.sendVars().then(() => {
        this.bsq.command.bulk(installCmds).then(() => {
          resolve();
        });
      });
    });
  }

  sendVars() {
    return new Promise((resolve, reject) => {
      if (this.bsq.vars.launchpad) {
        request.post({
          url: this.bsq.vars.hostHttpUrl,
          method: 'POST',
          json: {
            type: 'vars',
            data: this.bsq.vars
          }
        }, (err) => {
          if (err) reject(err);

          return resolve();
        });
      } else {
        return resolve();
      }
    });
  }
}

module.exports = InstallCMD;
