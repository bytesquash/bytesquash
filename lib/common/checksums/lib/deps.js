'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const precinct = require('precinct');

class Deps {
  constructor(bsq) {
    this.bsq = bsq;
  }
  
  crawl(data, file) {
    const pathParse = path.parse(file);

    let deps = [];

    if (pathParse.ext === '.js') {
      deps = this.javascriptCrawler(data, pathParse.dir);
    }

    return deps;
  }

  javascriptCrawler(data, dir) {
    const localRegex = /^.\.\/|^.\/|^\//;

    const files = [];

  }
}

module.exports;
