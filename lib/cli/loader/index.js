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
 * @name this.bsq.cli.loader.start
 */
  start() {
    process.stdout.write('.');
    this.loaderInterval = setInterval(() => {
      process.stdout.write('.');
    }, 3000, true);
  }

  /**
 * Loader stop
 * @name this.bsq.cli.loader.stop
 */
  stop() {
    // if (process.stdout.clearLine) {
    //   process.stdout.clearLine();
    //   process.stdout.cursorTo(0);
    // }
    process.stdout.write('\n');
    clearInterval(this.loaderInterval);
  }
}

module.exports = Loader;
