'use strict';

class DeployPluginIndex {
  constructor(bsq) {
    this.bsq = bsq;

    this.commands = [
      {
        arg         : ['deploy'],
        summary     : 'Deploys the current app into the cloud.',
        description : '',
        lifecycle   : [
          'app:validate',
          'functions:load',
          'app:info',
          // 'cloud:compile',
          // 'deploy:checksums:get',
          'deploy:run'
          // 'cloud:deploy',
          // 'deploy:checksums:save'
        ],
        options     : {
          function : {
            title        : 'function name',
            flag         : 'f',
            description  : 'Deploys only a specific function',
            value        : true,
            required     : false,
            defaultValue : null
          },
          force        : {
            title        : 'force to deploy',
            description  : 'Force a deployment even if there is no any code changes',
            value        : false,
            required     : false,
            defaultValue : null
          }
        },
        examples    : [
          '',
          '--force',
          '--function my-function'
        ]
      }
    ];
  }
}

module.exports = DeployPluginIndex;
