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
    const { templateType } = this;

    return new Promise((resolve, reject) => {
      if (templateType === 'github') {
        const branch = 'master';
        const repo = this.template.split('https://github.com/')[1];
        const filename = 'template-archive.tar.gz';
        const filepath = path.join('/tmp', filename);
        const output = this.projectPath;

        const repoUrl = `https://api.github.com/repos/${repo.toLowerCase()}/tarball/${branch}`;
        const options = {
          method: 'GET',
          url: repoUrl,
          headers: {
            'User-Agent': 'deploy agent'
          }
        };

        this.bsq.cli.log.info(`Retrieving template from ${colors.blue.bold(this.template)}`);

        request
          .get(options)
          .on('error', (err) => {
            reject(err);
          })
          .on('end', () => {
            setTimeout(() => {
              mkdirp.sync(output);
              tar.x(
                {
                  strip: 1,
                  file: filepath,
                  cwd: output
                }
              ).then(() => {
                fs.unlinkSync(filepath);

                this.postCreate();

                resolve();
              });
            }, 50);
          })
          .pipe(fs.createWriteStream(filepath));
      } else if (templateType === 'local') {
        const sharedData = this.bsq.yaml.parse(`${this.templateDir}/shared.yml`);
        this.bsq.cli.log.debug('Copying base files');
        fsExtra.copySync(`${this.templateDir}/data`, this.projectPath);
        this.bsq.cli.log.debug('Copying shared files');
        _.forEach(sharedData, (line) => {
          const xplShared = line.split(':');
          const source = xplShared[0];
          const target = xplShared[1];
          fsExtra.copySync(`${this.templateDir}/../../${source}`, `${this.projectPath}/${target}`);
        });

        this.postCreate();

        resolve();
      }
    });
  }

  postCreate() {
    const name = this.projectName;
    const accessKey = crypto.randomBytes(30).toString('hex');

    this.bsq.cli.log.debug('Post project creation actions');
    this.bsq.cli.log.debug('Compiling project config');
    const compiledProjectConfig = _.template(
      fs.readFileSync(`${this.projectPath}/squeezer.yml`, 'utf8')
    );

    const writeConfig = () => {
      fs.writeFileSync(
        `${this.projectPath}/squeezer.yml`,
        compiledProjectConfig({
          name,
          accessKey
        }).replace(/\\\\/g, '')
      );
    };
  }
}

module.exports = CreateCMD;
