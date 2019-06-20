'use strict';

class InstallCmd {
  constructor(bsq) {
    this.bsq = bsq;

    this.commands = [
      {
        arg         : ['install'],
        summary     : 'Install app\'s packages',
        lifecycle   : [
          'app:validate',
          'functions:load',
          'app:install'
        ],
        description : null,
        options     : {},
        examples    : [
          ''
        ]
      }
    ];
  }
}

module.exports = InstallCmd;
