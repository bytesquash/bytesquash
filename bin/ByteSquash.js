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
      app: {},
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

    this.loadApp();

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

  loadApp() {
    this.vars.app.isValid = false;

    const splitPath = process.cwd().split('/');

    // search the current cwd backwards for a valid app
    splitPath.reduce((curr) => {
      const currPath = splitPath.slice(0, curr).join('/');

      if (fs.existsSync(`${currPath}/bytesquash.yml`)) {
        this.vars.app.identifier = _.upperFirst(
          _.camelCase(this.yaml.parse(`${currPath}/bytesquash.yml`).name)
        );
      };
      this.vars.app = _.assign(
        {
          identifier: this.vars.app.identifier
        },
        this.yaml.parse(`${currPath}/bytesquash.yml`)
      );

      if (this.vars.platform) {
        this.vars.app.identifier = `Bsq${process.env.IDENTIFIER}`;
      }

      this.vars.app.isValid = true;
      this.vars.app.path = currPath;
    }, splitPath.length);

    if (this.vars.app.isValid === true) {
      const buildPath = `${this.vars.app.path}/.build`;
      this.vars.app.buildPath = buildPath;
      if (!fs.existsSync(buildPath)) {
        fs.mkdirSync(buildPath);
      }
    }
  }

  validateVersion() {
    const minNodeVersion = 8;
    const baseNodeVersion = parseInt(process.version.split('.')[0].replace(/\D/g, ''), 0);

    if (baseNodeVersion < minNodeVersion) {
      this.cli.log.error(
        `ByteSquash framework requires at least NodeJS version "${minNodeVersion}"`
      );
    }

    if (this.cli.params.get().options.stage) {
      this.vars.stage = this.cli.params.get().options.stage;
    }
  }

  loadHooks() {
    /* load frameworks hooks */
    const frameworkPlugins = this.yaml.parse(`${__dirname}/../lib/plugins/plugins.yml`);
    const appPath = this.vars.app.path;

    _.forOwn(frameworkPlugins.plugins, (plugin) => {
      const hookFile = `${__dirname}/../lib/plugins/${plugin}/hooks.yml`;

      if (fs.existsSync(hookFile)) {
        const data = this.yaml.parse(hookFile).map((val) => {
          val.path = `${__dirname}/../lib/plugins/${plugin}/${val.path}`;
          return val;
        });

        this.vars.hooks = this.vars.hooks.concat(data);
      };
    });

    /* load plugins hooks */
    const findPluginPath = (plugin) => {
      const paths = ['plugins', 'node_modules'];
      let pluginPath = null;

      _.forEach(paths, (val) => {
        const pluginBasePath = path.join(appPath, val, plugin);
        const hookPath = path.join(pluginBasePath, 'hooks.yml');
        if (fs.existsSync(hookPath)) {
          pluginPath = pluginBasePath;
        }
      });

      return pluginPath;
    };

    if (this.vars.app.isValid === true) {
      _.forEach(this.vars.app.plugins, (plugin) => {
        const pluginPath = findPluginPath(plugin);
        if (pluginPath) {
          const data = this
            .yaml.parse(path.join(pluginPath, 'hooks.yml'))
            .map((val) => {
              val.path = path.join(pluginPath, val.path);
              return val;
            });

          this.vars.customPluginPaths.push({
            path: path.join(pluginPath, 'index.js')
          });

          this.vars.hooks = this.vars.hooks.concat(data);
        }
      });
    }
  }
}

module.exports = new ByteSquash();
