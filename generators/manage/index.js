'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("manage", { type: Array, required: true });

  }
  writing() {
    const projectName = this.config.get('projectName')
    this.spawnCommand('python', ['manage.py', ...this.options.manage], { cwd: this.destinationPath(projectName) });
  }
};
