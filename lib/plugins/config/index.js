'use strict';

class Config {
  constructor(bsq) {
    this.bsq = bsq;

    this.commands = [
      {
        arg         : ['config'],
        summary     : 'Configure a setting which will be stored on ~/.bsqrc',
        description : null,
        lifecycle   : [
          'project:validate',
          'config:set'
        ],
        options     : {
          setting : {
            title        : 'setting name',
            flag         : 's',
            required     : true,
            defaultValue : null
          },
          value   : {
            title        : 'setting value',
            flag         : 'v',
            required     : true,
            defaultValue : null
          }
        },
        examples    : [
          '--setting aws-profile --value my-profile'
        ]
      }
    ];
  }
}

module.exports = Config;
