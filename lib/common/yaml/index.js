'use strict';

const yaml           = require('js-yaml');
const yamlinc = require('yaml-include');
const fs             = require('fs');
const _              = require('lodash');
const templateString = require('templatestring');

/**
 * Class that manages YAML parsing
 */
class YAML {
  constructor(bsq) {
    this.bsq = bsq;
  }
}

module.exports = YAML;
