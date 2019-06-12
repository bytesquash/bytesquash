'use strict';

const colors = require('colors');
const Promise = require('bluebird');
const _ = require('lodash');

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
        const hook = _.find(this.bsq.vars.hooks, { identifier: val });

        this.bsq.cli.log.debug(`# Running lifecycle event "${val}"`);


        if (!hook) {
          this.bsq.cli.log.error(`No hook available for the lifecycle event ${colors.blue.bold(val)}`);
        }

        const Class = require(`${hook.path}`);
        const fn = new Class(this.sqz);

        if (typeof fn[hook.function] !== 'function') {
          this.bsq.cli.log.error(
            `No hook function ${colors.blue.bold(hook.function)} available on ${colors.blue.bold(hook.path)}`
          );
        }

        const ret = fn[hook.function]();

        if (!ret || typeof ret.then !== 'function') {
          this.bsq.cli.log.warn(`Function ${colors.blue.bold(hook.function)} for hook ${colors.blue.bold(hook.identifier)} should be a Promise`);
        }

        return ret;
      }).then(() => {
        this.bsq.cli.log.debug('CLI lifecycle finished.');
        resolve();
      });
    });
  }

  sortHooks(hooks) {
    const baseHooks    = hooks.filter(val => (['before', 'after'].indexOf(val.split(':')[0]) < 0));
    const pluginHooks = hooks.filter(val => (['before', 'after'].indexOf(val.split(':')[0]) > -1));

    const findBaseHook = (pluginHook) => {
      const lastIndex = -1;
      let baseHook = null;

      _.forEach(baseHooks, (val) => {
        const index = pluginHook.indexOf(val);
        if (index > lastIndex) {
          baseHook = val;
        }
      });

      return baseHook;
    };

    pluginHooks.forEach((hook) => {
      const spl              = hook.split(':');
      const hookType = spl[0];
      const baseHook     =  findBaseHook(hook);
      const baseHookPosition = baseHooks.indexOf(baseHook);

    });

    return baseHooks;
  }
}

module.exports = Lifecycle;
