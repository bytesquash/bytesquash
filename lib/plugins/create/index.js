'use strict';

class AppCreateCmd {
  constructor(bsq) {
    this.bsq = bsq;

    this.commands = [
      {
        arg         : ['create'],
        summary     : 'Create a app',
        lifecycle   : [
          'app:create'
        ],
        description : null,
        options     : {
          app     : {
            title        : 'app\'s name',
            flag         : 'p',
            required     : false,
            defaultValue : 'my-first-app'
          },
          template    : {
            title        : 'App\'s template , get available templates : "bsq templates"',
            flag         : 't',
            required     : true,
            defaultValue : null
          },
          noChecksums : {
            title        : 'Disable functions checksum, this will make the deployment sequence considerably slower',
            flag         : 'n',
            required     : false,
            boolean      : true,
            defaultValue : false
          }
        },
        examples    : [
          '--app my-first-app --template api-nodejs',
          '--app my-first-app --template api-nodejs --noChecksum true'
        ]
      }
    ];
  }
}

module.exports = AppCreateCmd;
