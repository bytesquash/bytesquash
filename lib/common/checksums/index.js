'use strict';

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const _ = require('lodash');
const walkSync = require('walk-sync');
const Deps = require('./lib/deps');
const Data = require('./lib/data');
const Promise = require('bluebird');

class Checksums {
  constructor(bsq) {
    this.bsq = bsq;
    this.deps = new Deps(this.bsq);
    this.data = new Data(this.bsq);
  }

  compile(compileType, stage) {
    this.treeFile = path.join(this.bsq.vars.project.path, '.build', 'tree.json');

    if (!this.tree) {
      if (fs.existsSync(this.treeFile)) {
        this.tree = JSON.parse(fs.readFileSync(this.treeFile, 'utf8'));
      }
    }
  }
}

module.exports;
