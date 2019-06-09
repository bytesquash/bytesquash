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
      } else {
        this.tree = {
          files: {},
          functions: {}
        };
      }
    }

    return new Promise((resolve) => {
      const functions = this.bsq.vars.functions;

      const data = {
        checksums: [
          {
            stage: stage,
            functions: []
          }
        ]
      };

      this.data.get(compileType, stage).then((previousChecksumData) => {
        this.bsq.cli.log.debug('Calculating functions checksums');

        _.forEach(functions, (functionObject) => {
          let previousChecksum = null;
          const checksum = this.check(functionObject);

          const functionName = functionObject.name;

          if (previousChecksumData &&
            previousChecksumData.checksums && previousChecksumData.checksums.length > 0) {
            const functionChecksumData =
              _.find(previousChecksumData.checksums[0].functions, val => val.name === functionName);
            if (functionChecksumData) previousChecksum = functionChecksumData.checksum;
          }

          if (previousChecksum !== checksum) {
            this.bsq.vars.functions[functionName].changed = true;
          } else {
            this.bsq.vars.functions[functionName].changed = false;
          }

          this.bsq.vars.functions[functionName].checksum = checksum;

          data.checksums[0].functions.push({
            name: functionObject.name,
            checksum: checksum
          });
        });

        resolve(data);
      });
    });
  }

  check(functionObject) {
    const functionSrc = path.join(functionObject.path, 'src');
    const functionName = functionObject.name;
    const paths = walkSync(functionSrc, { directories: false })
      .map(val => path.join(functionSrc, val));

    if (!_.has(this.tree.functions, functionName)) {
      this.tree.functions[functionName] = {
        deps: [],
        packages: []
      };
    }

    _.forEach(_.concat(paths, this.tree.functions[functionName].deps), (file) => {
      this.parseFile(file, functionName);
    });

    fs.writeFileSync(this.treeFile, JSON.stringify(this.tree, null, 2), 'utf8');

    let concatMd5 = '';

    _.forEach(this.tree.functions[functionName].deps, (dep) => {
      concatMd5 += this.tree.files[dep].md5;
    });

    const checksum = crypto.createHash('md5').update(concatMd5).digest('hex');

    return checksum;
  }

  parseFile(file, functionName) {
    if (fs.existsSync(file)) {
      const stat = fs.statSync(file);

      if (!_.includes(this.tree.functions[functionName].deps, file)) {
        this.tree.functions[functionName].deps.push(file);
      }

      if (this.tree.files[file] && this.tree.files[file].mtimeMs === stat.mtimeMs
        && this.tree.functions[functionName].deps[file]) {
        return;
      }

      const data = fs.readFileSync(file, 'utf8');
      const md5 = crypto.createHash('md5').update(data).digest('hex');
      const deps = this.deps.crawl(data, file);

    }
  }
}

module.exports = Checksums;
