'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.poetryOptions = [];
    }
    prompting() {
        //poetry init [--name <...>] [--description <...>] [--author <...>] [--python <...>] [--dependency <...>] [--dev-dependency <...>] [-l <...>]

        const prompts = [
            {
                type: 'input',
                name: 'projectName',
                message: 'Enter name of the project?',
                default: this.config.get('projectName')
            },
            {
                type: 'input',
                name: 'projectVersion',
                message: 'Enter project version?',
                default: '0.1.0'
            },
            {
                type: 'input',
                name: 'projectDescription',
                message: 'Enter description of the project?',
                default: `Description of ${this.config.get('projectName')}`
            },
            {
                type: 'input',
                name: 'author',
                message: 'Enter author\'s name/email?',
                default: 'None <none@na.com>'
            }
        ];

        return this.prompt(prompts).then(props => {
            this.poetryOptions.push('-n');       // non-interactive
            this.poetryOptions.push('-q');       // quiet
            this.poetryOptions.push('--name');
            this.poetryOptions.push(`${props.projectName}@${props.projectVersion}`);
            this.poetryOptions.push('--description');
            this.poetryOptions.push(props.projectDescription);
            this.poetryOptions.push('--author');
            this.poetryOptions.push(props.author);

        });

    }

    writing() {
        this.spawnCommandSync('poetry', ['init', ...this.poetryOptions]);
    }
};
