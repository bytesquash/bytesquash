'use strict';

class ListCmd {
  constructor(bsq) {
    this.bsq = bsq;

    this.commands = [
      {
        arg         : ['list'],
        summary     : 'Lists all the available commands',
        description : null,
        lifecycle   : [
          'list:all'
        ]
      }
    ];
  }
}

module.exports = ListCmd;
