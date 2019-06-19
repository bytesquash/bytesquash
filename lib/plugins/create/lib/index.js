'use strict';

const colors = require('colors');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const path = require('path');
const tar = require('tar');
const request = require('request');
const fs = require('fs');
const fsExtra = require('fs-extra');
const _ = require('lodash');
const Promise = require('bluebird');

/**
 * Class representing project creation .
 */
class CreateCMD {
  constructor(bsq) {
    this.bsq = bsq;
    const { options } = this.bsq.cli.params.get();
    this.projectName = options.project;
    this.projectTemplate = options.template;
    this.noChecksums = options.noChecksums;
    this.projectType = options.type;
    this.projectPath = `${process.cwd()}/${this.projectName}`;
    this.template = options.template;
    this.templateDir = `${__dirname}/../../templates/lib/samples/${this.template}`;

    if (this.template.match(/^https:\/\/github\.com/g)) {
      this.templateType = 'github';
    } else {
      this.templateType = 'local';
    }
  }

  run() {
    return new Promise((resolve) => {
      this.bsq.cli.log.info(`Creating project "${this.projectName}"`);
      this.validate();
      this.copyFiles().then(() => {
        this.bsq.cli.log.info('Project successfully created !\n');
        this.bsq.cli.log.console(
          `Switch to the project's directory : ${colors.blue.bold(`cd ${this.projectName}`)}\n`
          + `Install project's requirements    : ${colors.blue.bold('bsq install')}\n`
          + `Compile project                   : ${colors.blue.bold('bsq compile')}\n`
          + `Run project locally               : ${colors.blue.bold('bsq serve')}\n`
        );
        resolve();
      });
    });
  }

  validate() {
    this.bsq.cli.log.debug(`Validating project name ${colors.white(this.projectName)}`);
    if (!this.projectName.match(/^[0-9a-z-]+$/i)) {
      this.bsq.cli.log.error('Project name should contain only letters , numbers or "-" sign');
    }
    this.bsq.cli.log.debug(`Checking if template ${colors.white(this.template)} is supported`);
    if (this.templateType === 'local' && !fs.existsSync(this.templateDir)) {
      this.bsq.cli.log.error(`Template ${colors.blue.bold(this.template)} it's not currently supported by Squeezer framework`);
    }
    this.bsq.cli.log.debug(`Checking if project ${colors.blue.bold(this.projectName)} exists`);
    if (fs.existsSync(this.projectPath)) {
      this.bsq.cli.log.error(`A project with name ${colors.blue.bold(this.projectName)} already exists`);
    }
  }

  copyFiles() {
    const templateType = this.templateType;

    return new Promise((resolve, reject) => {
      if (templateType === 'github') {
        const branch = 'master';
        const repo = this.template.split('https://github.com/')[1];
        const filename = 'template-archive.tar.gz';
        const filepath = path.join('/tmp', filename);

      }
    });
  }
}

module.exports = CreateCMD;
