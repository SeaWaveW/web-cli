"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs');
const pkg = require('../package.json');
module.exports = ({ source, framework, version, projectName }) => {
    const spinner = ora('Downloading please wait...');
    const templateName = `${framework}${version}`;
    const gitAddress = `${pkg.template[source]}/${templateName}`;
    spinner.start();
    download(`${gitAddress}/${templateName}`, `./${projectName}`, (err) => {
        if (err) {
            spinner.stop();
            console.log(chalk.red(err));
            return;
        }
        fs.readFile(`./${projectName}/package.json`, 'utf8', (err, data) => {
            if (err) {
                spinner.stop();
                console.log(chalk.yellow(err));
                return;
            }
            const copyData = JSON.parse(data);
            copyData.name = projectName;
            copyData.author = pkg.author;
            fs.writeFile(`./${projectName}/package.json`, JSON.stringify(copyData, null, 2), (err) => {
                spinner.stop();
                if (err)
                    return console.log(chalk.yellow(err));
                console.log(chalk.green('project init successfully!'));
                console.log(`
                    ${chalk.yellow(`cd ${projectName}`)}
                    ${chalk.yellow('npm install')}
                    ${chalk.yellow('npm run serve')}
                `);
            });
        });
    });
};
