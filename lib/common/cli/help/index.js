'use strict';

const colors = require('colors');
const _ = require('lodash');

const bin = Object.keys(require('../../../../package.json').bin)[0];

/**
 * Class which builds the help message  .
 */
class Help {
  /**
 * @param {Object} bsq - ByteSquash CLI instance
 */
  constructor(bsq) {
    this.bsq = bsq;
  }

  header(cmd) {
    let msg = '';
    const desc = cmd.description || cmd.summary;

    msg += `${spacer}${colors.blue.bold('\n Usage: ')}\n\n`;
    msg += `${spacerSub}$ ${bin} ${param} ${cmd.options ? '[options]' : ''}\n\n`;
    msg += `${spacer}${colors.blue.bold('Description:')}\n\n`;
    msg += `${desc.replace(/^/gm, spacerSub)}\n\n`;

    return msg;
  }

  /**
   * Return current version information
   * @returns {Object}
   * @name this.bsq.cli.help.get
  */
  get(commands, param) {
    const cmd = commands[param];
    const spacer = ' '.repeat(1);
    const spacerSub = ' '.repeat(4);

    let msg = this.header(cmd);
    let maxOptionLen = 0;

    if (cmd.options || cmd.flags) {
      msg += `${spacer}${colors.blue.bold('Options:')}\n\n`;

      _.forEach(cmd.options, (value, key) => {
        let keyLen = key.length;
        if (value.flag) {
          keyLen += 6;
        }
        if (keyLen > maxOptionLen) maxOptionLen = keyLen;
      });

      const fullSpacer = ' '.repeat((maxOptionLen) + 7);
      let leftSpacer = '';

      _.forEach(cmd.options, (value, key) => {
        const optionDisplay = `--${key}`
          + `${value.flag ? ` / -${value.flag} ` : ''}`;

        leftSpacer = ' '.repeat((maxOptionLen - optionDisplay.length) + 3);

        msg += `${spacerSub}${colors.blue.bold(optionDisplay)}`;
        msg += `${leftSpacer}${value.title} ${value.required ? '(required)' : '(optional)'}`;
        msg += `${value.defaultValue ? colors.blue.bold(` "${value.defaultValue}"`) : ''}\n`;
        msg += `${value.value ? `${' '.repeat(6)}value` : ''}`;
        msg += `${value.description ? `\n${value.description.replace(/^/gm, fullSpacer)}\n` : '\n'} `;
        msg += '\n';
      });
    }

    if (cmd.examples && cmd.examples.length > 0) {
      msg += `\n${spacer}${colors.blue.bold('Examples:')}\n\n`;

      _.forEach(cmd.examples, (example) => {
        msg += `${spacerSub}$ ${bin} ${param} ${example}\n`;
      });
    }

    return msg;
  }
}

module.exports = Help;
