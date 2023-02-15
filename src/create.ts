const inquirer = require('inquirer');
const framework = require('./framework')
const pkg = require('../package.json')

// 定义
export interface SelectInfo {
    projectName?: string
    source?: string
    framework?: string
    version?: string
}

// 存储选择信息
let selectInfo: SelectInfo = {}

module.exports = (projectName: string) => {
    // 框架选择
    inquirer.prompt([
        // 项目名
        {
          type: 'list',
          name: 'source',
          message: 'Select a Download Source:',
          choices: Object.keys(pkg.template),
          default: Object.keys(pkg.template)[0],
          filter (val: string) {
            return val.trim()
          }
        },
        // 框架选择
        {
            type: 'list',
            name: 'framework',
            message: 'Select a framework:',
            choices: Object.keys(framework).map((name: string) => name[0].toUpperCase() + name.substring(1)),
            default: Object.keys(framework)[0],
            filter: (val: string) => {
                return val.toLowerCase()
            }
        },
    ]).then((select: SelectInfo) => {
        // 保存框架信息
        selectInfo = select
        selectInfo.projectName = projectName
        // 根据框架读取版本
        inquirer.prompt([
            {
                type: 'list',
                name: 'version',
                message: 'Select a version:',
                choices: framework[select.framework as string],
                filter: (val: string) => {
                    return val.replace(/[^\d]/g,'')
                }
            },
        ]).then((select: SelectInfo) => {
            // 更新选中
            selectInfo = {
                ...selectInfo,
                ...select
            }
            // 开始下载
            require('./download')(selectInfo)
        })
    })
}