'use strict';

const yaml = require('js-yaml');
const yamlinc = require('yaml-include');
const fs = require('fs');
const _ = require('lodash');
const templateString = require('templatestring');

/**
 * Class that manages YAML parsing
 */
class YAML {
  constructor(bsq) {
    this.bsq = bsq;
  }

  /**
   * Parse an YAML file
   *
   * @Return {Object} data - YAML data
   * @name this.bsq.yaml.parse
   */
  parse(file, input) {
    const bsq = this.bsq.vars || {};

    let data;
    let fileData;
    let inputData;
    let fileObj;

    const loadOptions = {
      schema: yamlinc.YAML_INCLUDE_SCHEMA
    };

    try {
      fileData = fs.readFileSync(file, 'utf8');

    } catch (e) {

    }
  }
}

module.exports = YAML;
