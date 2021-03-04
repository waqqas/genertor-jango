"use strict";
const _ = require("lodash");
const ejs = require("ejs");

const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option("defaultApp", {
      desc: "Name of app to add models in",
      type: String,
      default: this.config.get("defaultApp"),
      required: false
    });
    this.props = _.merge(
      {},
      this.config.getAll(),
      _.pick(this.options, "defaultApp")
    );
  }

  prompting() {
    const prompts = [];
    if (_.isEmpty(this.props.app)) {
      prompts.push({
        type: "input",
        name: "config.defaultApp",
        message: "Enter app name to add models in?"
      });
    }

    _.merge(prompts, [
      {
        type: "input",
        name: "model.name",
        message: "Enter name of the model?"
      }
    ]);

    if (!_.isEmpty(prompts)) {
      return this.prompt(prompts).then(props => {
        _.merge(this.props, props.config);
        this.model = props.model;
        // This.log(this.props);
      });
    }
  }

  writing() {
    // This.log(this.model);
    this.log(this.templatePath("model.py.ejs"));
    const modelCode = ejs.render(
      this.fs.read(this.templatePath("model.py.ejs")),
      this.model
    );
    this.fs.append(
      this.destinationPath(`${this.props.defaultApp}/models.py`),
      modelCode
    );
  }
};
