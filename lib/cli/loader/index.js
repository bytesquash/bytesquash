'use strict';

/**
 * Class that represents CLI loader.
 */
class Loader {
  constructor(bsq) {
    this.bsq = bsq;
  }

  /**
 * Loader start
 * @name this.sqz.cli.loader.start
 */
  start() {
    process.stdout.write('.');
    this.loaderInterval = setInterval(() => {
      process.stdout.write('.');
    }, 3000, true);
  }
}

module.exports = Loader;
