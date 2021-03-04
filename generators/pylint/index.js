'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
    writing() {
        this.fs.copy(
            this.templatePath('**'),
            this.destinationPath('')
        );
    }
};
