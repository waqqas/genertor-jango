"use strict";
const Generator = require("../generator-base.js");

module.exports = class extends Generator {
  writing() {
    this.fs.copy(this.templatePath("**"), this.destinationPath(""));
  }
};
