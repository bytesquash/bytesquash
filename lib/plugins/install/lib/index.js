'use strict';

const Promise = require('bluebird');
const request = require('request');

class InstallCMD {
  constructor(bsq) {
    this.bsq = bsq;
  }

  run() {
    return new Promise((resolve) => {
      this.projectInstall().then(() => {
        this.bsq.cli.log.info('Installed !');
        resolve();
      });
    });
  }

  projectInstall() {
    return new Promise((resolve) => {
      const { project } = this.bsq.vars;
      const installCmds = this.bsq.yaml.parse(
        `${project.path}/lib/hooks/commands/install/project.yml`,
        {
          project: this.bsq.vars.project,
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
      if (this.bsq.vars.platform) {
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
