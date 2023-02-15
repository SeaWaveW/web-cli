"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require('inquirer');
const framework = require('./framework');
const pkg = require('../package.json');
let selectInfo = {};
module.exports = (projectName) => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'source',
            message: 'Select a Download Source:',
            choices: Object.keys(pkg.template),
            default: Object.keys(pkg.template)[0],
            filter(val) {
                return val.trim();
            }
        },
        {
            type: 'list',
            name: 'framework',
            message: 'Select a framework:',
            choices: Object.keys(framework).map((name) => name[0].toUpperCase() + name.substring(1)),
            default: Object.keys(framework)[0],
            filter: (val) => {
                return val.toLowerCase();
            }
        },
    ]).then((select) => {
        selectInfo = select;
        selectInfo.projectName = projectName;
        inquirer.prompt([
            {
                type: 'list',
                name: 'version',
                message: 'Select a version:',
                choices: framework[select.framework],
                filter: (val) => {
                    return val.replace(/[^\d]/g, '');
                }
            },
        ]).then((select) => {
            selectInfo = Object.assign(Object.assign({}, selectInfo), select);
            require('./download')(selectInfo);
        });
    });
};
