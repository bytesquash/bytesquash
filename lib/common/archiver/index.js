'use strict';

const archiver = require('archiver');
const Promise  = require('bluebird');
const path     = require('path');
const fs       = require('fs');

/**
 * Class representing files archiving
 */
class Archiver {
  constructor(bsq) {
    this.bsq = bsq;
  }

  /**
   * Zips a directory
   *
   * @param {string} source - source directory path "/tmp/my-files"
   * @param {string} dest - destination path "/tmp/myfiles.zip"
   *
   * @name this.bsq.archive
   */
  zipDir(source, dest) {
    const archive     = archiver.create('zip', {});
    const archiveName = path.basename(dest);

    const output = fs.createWriteStream(dest);

    return new Promise((resolve, reject) => {
      archive.on('error', (err) => {
        reject(err);
      });

      output.on('close', () => {
        this.bsq.cli.log.debug(`Archive "${archiveName}" successfully created`);
        resolve();
      });

      archive.pipe(output);

      archive.directory(source, './');

      archive.finalize();
    });
  }
}

module.exports = Archiver;
