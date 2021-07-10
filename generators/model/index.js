"use strict";
const _ = require("lodash");
const ejs = require("ejs");

const Generator = require("../generator-base.js");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option("appName", {
      desc: "Name of app to add models in",
      type: String,
      default: this.config.get("appName"),
      required: false
    });

    this.argument("modelName", {
      desc: "Name of the model",
      required: false,
      type: String
    });

    _.merge(this.props, _.pick(this.options, "appName", "modelName"));
  }

  prompting() {
    const prompts = [];
    if (_.isEmpty(this.props.appName)) {
      prompts.push({
        type: "input",
        name: "appName",
        message: "Enter app name to add models in?"
      });
    }

    if (_.isEmpty(this.props.modelName)) {
      prompts.push({
        type: "input",
        name: "modelName",
        message: "Enter name of the model?"
      });
    }

    if (!_.isEmpty(prompts)) {
      return this.prompt(prompts).then(props => {
        _.merge(this.props, props);
      });
    }
  }

  async writing() {
    this.props.modelName = _.capitalize(this.props.modelName);

    const modelCode = await ejs.renderFile(
      this.templatePath("model.py.ejs"),
      this.props
    );

    this.fs.append(
      this.destinationPath(`${this.props.appName}/models.py`),
      modelCode
    );
  }
};
