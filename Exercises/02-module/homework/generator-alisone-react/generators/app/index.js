
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    // 用户提示
    prompting () {
        return this.prompt([
            {
                type: 'input',
                name: 'This Project Name',
                default: this.appname
            },
            {
                type: 'input',
                name: 'This Project Version',
                default: this.rootGeneratorVersion
            }
        ]).then(answer => {
            this.answer = answer
        })
    }

    writing () {
        const templates = [
            '.gitignore',
            'package.json',
            'README.md',
            'public/favicon.ico',
            'public/index.html',
            'public/logo192.png',
            'public/logo512.png',
            'public/manifest.json',
            'public/robots.txt',
            'src/App.css',
            'src/App.js',
            'src/App.test.js',
            'src/index.css',
            'src/index.js',
            'src/logo.svg',
            'src/reportWebVitals.js',
            'src/setupTests.js'
        ]
        templates.forEach(item => {
            this.fs.copyTpl(
                this.templatePath(item),
                this.destinationPath(item),
                this.answer
            )
        })

    }
}