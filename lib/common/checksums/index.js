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
  constructor(sqz) {
    this.sqz = sqz;
    this.deps = new Deps(this.sqz);
    this.data = new Data(this.sqz);
  }
}

module.exports;
