"use strict";
const _ = require("lodash");
const path = require("path");
const ejs = require("ejs");
const chalk = require("chalk");
const pluralize = require("pluralize");
const Generator = require("../generator-base.js");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option("appName", {
      desc: "App name",
      type: String,
      default: this.config.get("appName"),
      required: false
    });

    this.argument("modelName", {
      desc: "Model name",
      required: false,
      type: String
    });

    this.argument("modelsPath", {
      desc: "Python path to models",
      required: false,
      type: String
    });

    _.merge(
      this.props,
      _.pick(this.options, "appName", "modelName", "modelsPath")
    );
  }

  prompting() {
    const prompts = [];
    if (_.isEmpty(this.props.appName)) {
      prompts.push({
        type: "input",
        name: "appName",
        message: "Enter app name"
      });
    }

    if (_.isEmpty(this.props.modelName)) {
      prompts.push({
        type: "input",
        name: "modelName",
        message: "Enter model name"
      });
    }

    if (_.isEmpty(this.props.modelsPath)) {
      prompts.push({
        type: "input",
        name: "modelsPath",
        message: "Enter python path to models"
      });
    }

    if (!_.isEmpty(prompts)) {
      return this.prompt(prompts).then(props => {
        _.merge(this.props, props);
      });
    }
  }

  async writing() {
    this.props.model = {
      lower: _.lowerCase(this.props.modelName),
      upper: _.upperCase(this.props.modelName),
      capital: _.capitalize(this.props.modelName),
      camel: _.camelCase(this.props.modelName),
      plural: pluralize.plural(this.props.modelName),
      singlular: pluralize.singular(this.props.modelName)
    };

    // Serializers.py
    this._updateSerializers();

    // Views.py
    this._updateViews();

    // Urls.py
    this._updateUrls();
  }

  async _updateSerializers() {
    const serializersFilePath = path.join(this.props.appName, "serializers.py");

    if (!this.fs.exists(this.destinationPath(serializersFilePath))) {
      this._addImportStatement(
        serializersFilePath,
        "from rest_framework import serializers"
      );
    }

    this._addImportStatement(
      serializersFilePath,
      `from ${this.props.modelsPath} import ${this.props.modelName}`
    );

    const code = await ejs.renderFile(
      this.templatePath("model_serializer.py.ejs"),
      this.props
    );

    this.fs.append(this.destinationPath(serializersFilePath), code);
  }

  async _updateViews() {
    const viewsFilePath = path.join(this.props.appName, "views.py");

    this._addImportStatement(
      viewsFilePath,
      "from rest_framework import viewsets"
    );

    this._addImportStatement(
      viewsFilePath,
      "from rest_framework import permissions"
    );

    this._addImportStatement(
      viewsFilePath,
      `from ${this.props.modelsPath} import ${this.props.modelName}`
    );

    this._addImportStatement(
      viewsFilePath,
      `from ${this.props.appName}.serializers import ${this.props.modelName}Serializer`
    );

    const code = await ejs.renderFile(
      this.templatePath("model_viewset.py.ejs"),
      this.props
    );

    this.fs.append(this.destinationPath(viewsFilePath), code);
  }

  async _updateUrls() {
    const urlsFilePath = path.join(this.props.projectName, "urls.py");

    this._addImportStatement(
      urlsFilePath,
      "from rest_framework import routers"
    );

    this._addImportStatement(urlsFilePath, "from django.urls import include");

    this._addImportStatement(
      urlsFilePath,
      `from ${this.props.projectName},${this.props.appName} import views`
    );

    this._addInUrlPatterns("path('', include(router.urls))");

    this._addBefore(
      urlsFilePath,
      "urlpatterns",
      await ejs.renderFile(this.templatePath("urls_router.py.ejs"), this.props)
    );
  }

  end() {
    this.log(
      `Please update the ${chalk.red("fields")} property of the ${_.capitalize(
        this.props.modelName
      )}Serializer::Meta class`
    );
  }
};
