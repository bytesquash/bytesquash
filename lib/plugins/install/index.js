'use strict';

class InstallCmd {
  constructor(bsq) {
    this.bsq = bsq;

    this.commands = [
      {
        arg         : ['install'],
        summary     : 'Install project\'s packages',
        lifecycle   : [
          'project:validate',
          'functions:load',
          'project:install'
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
