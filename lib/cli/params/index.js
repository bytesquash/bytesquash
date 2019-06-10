'use strict';

/**
 * Class for CLI params orchestration
 */
class Params {
  constructor(bsq) {
    this.bsq = bsq;
    this.params = this.parse(process.argv.slice(2));
  }

  /**
   * Set CLI params object
   * @name this.bsq.cli.params.set
   */
  set(params) {
    this.params = params;
  }

  /**
   * Set an option value
   * @name this.bsq.cli.params.setOption
  */
  setOption(name, value) {
    if (!this.params.options[name]) {
      this.params.options[name] = value;
    }
  }

  /**
   * Return CLI params
   * @returns {Object}
   * @name this.bsq.cli.params.get
   */
  get() {
    return this.params;
  }

  /**
   * Return CLI params
   * @returns {Object}
   * @name this.bsq.cli.params.get
   */
  parse(args) {
    let commands = args.shift();
    commands     = commands ? commands.split(':') : [];

    const raw = args.join(' ');
    let curArgType = 'args';

  }
}

module.exports = Params;
