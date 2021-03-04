'use strict';
const Generator = require('yeoman-generator');
const path = require('path');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.currentConfig = this.config.getAll();
    }
    configuring() {
        if (this.currentConfig.dependencyManager === 'poetry') {
            this.spawnCommandSync('poetry', ['add', 'djangorestframework', 'markdown', 'django-filter']);
        } else if (this.currentConfig.dependencyManager === 'pip') {
            this.spawnCommandSync('pip', ['install', 'djangorestframework', 'markdown', 'django-filter']);
        }
    }

    prompting() {
        const prompts = [
            {
                type: 'input',
                name: 'apiUrlPath',
                message: 'Enter url path for API?',
                default: 'api',
            },
        ];

        return this.prompt(prompts).then(props => {
            this.currentConfig.apiUrlPath = props.apiUrlPath;
        });

    }

    writing() {
        this._add_in_installed_apps('rest_framework');
        this._add_in_url_patterns(`path('${this.currentConfig.apiUrlPath}/', include('rest_framework.urls', namespace='rest_framework'))`);
        this._append_in_settings(`REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}`);
    }

    _add_in_installed_apps(appName) {
        const settingsFilePath = this.destinationPath(path.join(this.currentConfig.projectName, 'settings.py'));
        if (!this.fs.exists(settingsFilePath)) {
            this.log('Cannot file settings.py');
            return;
        }

        const content = this.fs.read(settingsFilePath);
        const updated = content.replace(/INSTALLED_APPS = \[/, `INSTALLED_APPS = [\n    '${appName}',`);
        this.fs.write(settingsFilePath, updated);
    }

    _append_in_settings(data) {
        const settingsFilePath = this.destinationPath(path.join(this.currentConfig.projectName, 'settings.py'));
        if (!this.fs.exists(settingsFilePath)) {
            this.log('Cannot file settings.py');
            return;
        }

        const content = this.fs.read(settingsFilePath);
        const updated = content.concat('\n', data, '\n');
        this.fs.write(settingsFilePath, updated);
    }

    _add_in_url_patterns(pattern) {
        const urlsFilePath = this.destinationPath(path.join(this.currentConfig.projectName, 'urls.py'));
        if (!this.fs.exists(urlsFilePath)) {
            this.log('Cannot file urls.py');
            return;
        }

        const content = this.fs.read(urlsFilePath);
        const updated = content.replace(/urlpatterns = \[/, `urlpatterns = [\n    ${pattern},`);
        this.fs.write(urlsFilePath, updated);
    }
};
