'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const CommonArchiver = require('../lib/common/archiver');
const CommonYaml = require('../lib/common/yaml');
const CommonCommand = require('../lib/common/command');
const CommonCliError = require('../lib/common/cli/error');
const CommonCliLoader = require('../lib/common/cli/loader');
const CommonCliLog = require('../lib/common/cli/log');
const CommonCliParams = require('../lib/common/cli/params');
const CommonCliHelp = require('../lib/common/cli/help');
const CommonUtils = require('../lib/common/utils');
const CommonLifecycle = require('../lib/common/lifecycle');
const CommonVariables = require('../lib/common/variables');
const CommonVersion = require('../lib/common/version');
const CommonConfig = require('../lib/common/config');
const CommonValidate = require('../lib/common/validate');
const CommonChecksums = require('../lib/common/checksums');
const CommonFunctions = require('../lib/common/functions');

class ByteSquash {
  init() {
    this.deploy = {};
    this.cloud = {};

    this.vars = {
      project: {},
      customPluginPaths: [],
      previousChecksums: {
        functions: {}
      },
      currentChecksums: {
        functions: {}
      },
      functions: {},
      hooks: [],
      apiBaseUrl: 'https://api.bytesquash.com/prod',
      hostHttpUrl: `http://${process.env.HOST_IP}:${process.env.HOST_HTTP_PORT}`,
      platform: process.env.PLATFORM,
      outputs: {},
      assets: {
        functions: [],
        uploadPaths: []
      }
    }

    if (process.argv[2] === 'deploy') {
      this.vars.deploy = true;
    }

    this.yaml = new CommonYaml(this);

    this.loadProject();

    this.cli = {
      params: new CommonCliParams(this),
      error: new CommonCliError(this),
      loader: new CommonCliLoader(this),
      log: new CommonCliLog(this),
      help: new CommonCliHelp(this)
    };

    this.utils = new CommonUtils(this);
    this.lifecycle = new CommonLifecycle(this);
    this.command = new CommonCommand(this);
    this.variables = new CommonVariables(this);
    this.archive = new CommonArchiver(this);
    this.version = new CommonVersion(this);
    this.validate = new CommonValidate(this);
    this.checksums = new CommonChecksums(this);
    this.functions = new CommonFunctions(this);
    this.config = new CommonConfig(this);

    this.validateVersion();
    this.loadHooks();
  }

  loadProject() {
    this.vars.project.isValid = false;

    const splitPath = process.cwd().split('/');

    // search the current cwd backwards for a valid project
    splitPath.reduce((curr) => {
      const currPath = splitPath.slice(0, curr).join('/');

      if (fs.existsSync(`${currPath}/bytesquash.yml`)) {
        this.vars.project.identifier = _.upperFirst(
          _.camelCase(this.yaml.parse(`${currPath}/bytesquash.yml`).name)
        );
      };
      this.vars.project = _.assign(
        {
          identifier: this.vars.project.identifier
        },
        this.yaml.parse(`${currPath}/bytesquash.yml`)
      );

      if (this.vars.platform) {
        this.vars.project.identifier = `Sqz${process.env.IDENTIFIER}`;
      }

      this.vars.project.isValid = true;
      this.vars.project.path = currPath;
    }, splitPath.length);

    if (this.vars.project.isValid === true) {
      const buildPath = `${this.vars.project.path}/.build`;
    }
  }
}

module.exports = new ByteSquash();
