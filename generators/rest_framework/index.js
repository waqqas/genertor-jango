"use strict";
const _ = require("lodash");
const Generator = require("../generator-base.js");

module.exports = class extends Generator {
  configuring() {
    if (this.props.dependencyManager === "poetry") {
      this.spawnCommandSync("poetry", [
        "add",
        "djangorestframework",
        "markdown",
        "django-filter"
      ]);
    } else if (this.props.dependencyManager === "pip") {
      this.spawnCommandSync("pip", [
        "install",
        "djangorestframework",
        "markdown",
        "django-filter"
      ]);
    }
  }

  prompting() {
    const prompts = [
      {
        type: "input",
        name: "apiUrlPath",
        message: "Enter url path for API?",
        default: "api"
      }
    ];

    return this.prompt(prompts).then(props => {
      _.merge(this.props, props);
    });
  }

  writing() {
    this._addInInstalledApps("rest_framework");
    this._addInUrlPatterns(
      `path('${this.props.apiUrlPath}/', include('rest_framework.urls', namespace='rest_framework'))`
    );
    this._appendInSettings(`REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}`);
  }
};
