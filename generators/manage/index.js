"use strict";
const Generator = require("yeoman-generator");

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
        this.config.set("defaultApp", this.options.manage[1]);
      }
    }
  }

  writing() {
    this.spawnCommand("python", ["manage.py", ...this.options.manage], {
      cwd: this.destinationPath("")
    });
  }
};
