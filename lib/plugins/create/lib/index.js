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
 * Class representing app creation .
 */
class CreateCMD {
  constructor(bsq) {
    this.bsq = bsq;
    const { options } = this.bsq.cli.params.get();
    this.appName = options.app;
    this.appTemplate = options.template;
    this.noChecksums = options.noChecksums;
    this.appType = options.type;
    this.appPath = `${process.cwd()}/${this.appName}`;
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
      this.bsq.cli.log.info(`Creating app "${this.appName}"`);
      this.validate();
      this.copyFiles().then(() => {
        this.bsq.cli.log.info('App successfully created !\n');
        this.bsq.cli.log.console(
          `Switch to the app's directory : ${colors.blue.bold(`cd ${this.appName}`)}\n`
          + `Install app's requirements    : ${colors.blue.bold('bsq install')}\n`
          + `Compile app                   : ${colors.blue.bold('bsq compile')}\n`
          + `Run app locally               : ${colors.blue.bold('bsq serve')}\n`
        );
        resolve();
      });
    });
  }

  validate() {
    this.bsq.cli.log.debug(`Validating app name ${colors.white(this.appName)}`);
    if (!this.appName.match(/^[0-9a-z-]+$/i)) {
      this.bsq.cli.log.error('App name should contain only letters , numbers or "-" sign');
    }
    this.bsq.cli.log.debug(`Checking if template ${colors.white(this.template)} is supported`);
    if (this.templateType === 'local' && !fs.existsSync(this.templateDir)) {
      this.bsq.cli.log.error(`Template ${colors.blue.bold(this.template)} it's not currently supported by Squeezer framework`);
    }
    this.bsq.cli.log.debug(`Checking if app ${colors.blue.bold(this.appName)} exists`);
    if (fs.existsSync(this.appPath)) {
      this.bsq.cli.log.error(`A app with name ${colors.blue.bold(this.appName)} already exists`);
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
        const output = this.appPath;

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
        fsExtra.copySync(`${this.templateDir}/data`, this.appPath);
        this.bsq.cli.log.debug('Copying shared files');
        _.forEach(sharedData, (line) => {
          const xplShared = line.split(':');
          const source = xplShared[0];
          const target = xplShared[1];
          fsExtra.copySync(`${this.templateDir}/../../${source}`, `${this.appPath}/${target}`);
        });

        this.postCreate();

        resolve();
      }
    });
  }

  postCreate() {
    const name = this.appName;
    const accessKey = crypto.randomBytes(30).toString('hex');

    this.bsq.cli.log.debug('Post app creation actions');
    this.bsq.cli.log.debug('Compiling app config');
    const compiledAppConfig = _.template(
      fs.readFileSync(`${this.appPath}/squeezer.yml`, 'utf8')
    );

    const writeConfig = () => {
      fs.writeFileSync(
        `${this.appPath}/squeezer.yml`,
        compiledAppConfig({
          name,
          accessKey
        }).replace(/\\\\/g, '')
      );
    };

    writeConfig();
  }
}

module.exports = CreateCMD;
