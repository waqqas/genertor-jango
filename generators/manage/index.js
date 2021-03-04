'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("manage", { type: Array, required: true });

  }
  writing() {
    this.spawnCommand('python', ['manage.py', ...this.options.manage], { cwd: this.destinationPath('') });
  }
};
