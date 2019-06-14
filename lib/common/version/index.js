'use strict';

const settings = require('../../../package.json');

/**
 * Class which builds an Object for returning local version information  .
 */
class Version {
  constructor(bsq) {
    this.bsq = bsq;

    this.versionData = {
      bytesquashCliVersion: `v${settings.version}`,
      nodeVersion: process.version,
      osPlatform: process.platform
    };
  }

  /**
   * Returns framework version information
   *
   * @Return {Object}
   * @name this.bsq.version.get
   */
  get() {
    return this.versionData;
  }

  /**
   * Returns framework  markdown version information
   *
   * @Return {String}
   * @name this.bsq.version.msg
   */
  msg() {
    const msg = `* ByteSquash CLI version: ${this.versionData.bytesquashCliVersion}\n`
      + `* Node version: ${this.versionData.nodeVersion}\n`
      + `* OS platform: ${this.versionData.osPlatform}`;

    return msg;
  }
}

module.exports = Version;
