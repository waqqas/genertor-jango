"use strict";
const _ = require("lodash");
const Generator = require("../generator-base.js");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option("default", {
      desc: "Set value as default",
      required: false,
      default: false
    });

    this.argument("manage", {
      type: Array,
      required: true,
      desc: "Parameters to pass to manage.py"
    });
  }

  configuring() {
    if (this.options.manage[0] === "startapp") {
      if (this.options.default) {
        this.config.set("appName", this.options.manage[1]);
      }
    }
  }

  writing() {
    this.spawnCommandSync("python", ["manage.py", ...this.options.manage], {
      cwd: this.destinationPath("")
    });

    if (this.options.manage[0] === "startapp") {
      const app = this.options.manage[1];
      this._addInInstalledApps(`${app}.apps.${_.capitalize(app)}Config`);
    }
  }
};
