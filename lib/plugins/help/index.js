'use strict';

class HelpCmd {
  constructor(bsq) {
    this.bsq = bsq;

    this.commands = [
      {
        arg         : ['help'],
        summary     : 'Displays help for a specific command',
        description : null,
        lifecycle   : [
          'help:run'
        ]
      }
    ];
  }
}

module.exports = HelpCmd;
