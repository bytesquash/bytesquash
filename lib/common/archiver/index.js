'use strict';

const archiver = require('archiver');
const Promise  = require('bluebird');
const path     = require('path');
const fs       = require('fs');

/**
 * Class representing files archiving
 */
class Archiver {
  constructor(sqz) {
    this.sqz = sqz;
  }

  /**
   * Zips a directory
   *
   * @param {string} source - source directory path "/tmp/my-files"
   * @param {string} dest - destination path "/tmp/myfiles.zip"
   *
   * @name this.sqz.archive
   */
  zipDir(source, dest) {
    const archive     = archiver.create('zip', {});
    const archiveName = path.basename(dest);

    return new Promise((resolve, reject) => {

    });
  }
}

module.exports = Archiver;