"use strict";
const Generator = require("../generator-base.js");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.currentConfig = this.config.getAll();
  }

  configuring() {
    if (this.currentConfig.dependencyManager === "poetry") {
      this.spawnCommandSync("poetry", [
        "add",
        "djangorestframework",
        "markdown",
        "django-filter"
      ]);
    } else if (this.currentConfig.dependencyManager === "pip") {
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
      this.currentConfig.apiUrlPath = props.apiUrlPath;
    });
  }

  writing() {
    this._addInInstalledApps("rest_framework");
    this._addInUrlPatterns(
      `path('${this.currentConfig.apiUrlPath}/', include('rest_framework.urls', namespace='rest_framework'))`
    );
    this._appendInSettings(`REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}`);
  }
};
