'use strict';

const settings = require('../../../package.json');

/**
 * Class which builds an Object for returning local version information  .
 */
class Version {
  constructor(bsq) {
    this.bsq = bsq;

    this.versionData = {
      bytesquashCliVersion : `v${settings.version}`,
      nodeVersion        : process.version,
      osPlatform         : process.platform
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
}

module.exports = Version;
