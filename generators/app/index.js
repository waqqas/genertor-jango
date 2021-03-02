'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("projectName", { type: String, required: true });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the rad ${chalk.red('generator-jango')} generator!`)
    );

    // const prompts = [
    //   {
    //     type: 'input',
    //     name: 'projectName',
    //     message: 'Enter name of the project?',
    //     store: true
    //   }
    // ];

    // return this.prompt(prompts).then(props => {
    //   // To access props later use this.props.someAnswer;
    //   this.props = props;
    // });
  }

  writing() {
    this.spawnCommandSync('django-admin', ['startproject', this.options.projectName]);
    this.config.set('projectName', this.options.projectName);
  }

  install() {
    // moving .yo-rc.json in the project
    this.fs.move(this.destinationPath('.yo-rc.json'), this.destinationPath(path.join(this.options.projectName, '.yo-rc.json')));
  }
};
