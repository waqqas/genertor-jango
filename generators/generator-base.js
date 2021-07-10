const Generator = require("yeoman-generator");
const path = require("path");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.props = this.config.getAll();
  }

  _addInInstalledApps(appName) {
    const settingsFilePath = this.destinationPath(
      path.join(this.props.projectName, "settings.py")
    );
    if (!this.fs.exists(settingsFilePath)) {
      this.log("Cannot file settings.py");
      return;
    }

    const content = this.fs.read(settingsFilePath);
    const updated = content.replace(
      /INSTALLED_APPS = \[/,
      `INSTALLED_APPS = [\n    '${appName}',`
    );
    this.fs.write(settingsFilePath, updated);
  }

  _appendInSettings(data) {
    const settingsFilePath = this.destinationPath(
      path.join(this.props.projectName, "settings.py")
    );
    if (!this.fs.exists(settingsFilePath)) {
      this.log("Cannot file settings.py");
      return;
    }

    const content = this.fs.read(settingsFilePath);
    const updated = content.concat("\n", data, "\n");
    this.fs.write(settingsFilePath, updated);
  }

  _addInUrlPatterns(pattern) {
    const urlsFilePath = this.destinationPath(
      path.join(this.props.projectName, "urls.py")
    );
    if (!this.fs.exists(urlsFilePath)) {
      this.log("Cannot file urls.py");
      return;
    }

    const content = this.fs.read(urlsFilePath);
    const updated = content.replace(
      /urlpatterns = \[/,
      `urlpatterns = [\n    ${pattern},`
    );
    this.fs.write(urlsFilePath, updated);
  }

  _addImportStatement(filePath, statement) {
    const path = this.destinationPath(filePath);
    let content = "";
    if (this.fs.exists(path)) {
      content = this.fs.read(path);
    }

    this.fs.write(path, `${statement}\n` + content);
  }

  _addBefore(filePath, pattern, statement) {
    const content = this.fs.read(filePath);
    const index = content.indexOf(pattern);
    if (index !== -1) {
      this.fs.write(filePath, content.substr(0, index));
      this.fs.write(filePath, statement);
      this.fs.write(filePath, content.substr(index));
    }
  }
};
