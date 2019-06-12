'use strict';

const colors  = require('colors');
const Promise = require('bluebird');
const _       = require('lodash');

/**
 * Class that manages CLI's lifecycle
 */
class Lifecycle {
  constructor(bsq) {
    this.bsq = bsq;
  }

  /**
   * Run each event from the lifecycle
   *
   * @param {Array} lifecycle - lifecycle array
   */
  run(lifecycle) {
    const hooks = this.sortHooks(lifecycle);

    return new Promise((resolve) => {
      this.bsq.cli.log.debug(`# Starting CLI lifecycle : [ ${hooks.join(colors.green(' , '))} ]`);

      Promise.each(hooks, (val) => {
        const hook = _.find(this.bsq.vars.hooks, { identifier : val });

        this.bsq.cli.log.debug(`# Running lifecycle event "${val}"`);


        if (!hook) {
          this.bsq.cli.log.error(`No hook available for the lifecycle event ${colors.blue.bold(val)}`);
        }

        const Class = require(`${hook.path}`);
        const fn    = new Class(this.sqz);

        if (typeof fn[hook.function] !== 'function') {
          this.bsq.cli.log.error(
            `No hook function ${colors.blue.bold(hook.function)} available on ${colors.blue.bold(hook.path)}`
          );
        }

        const ret = fn[hook.function]();

      });
    });
  }
}

module.exports = Lifecycle;
