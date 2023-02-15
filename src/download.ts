const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs');
import type { SelectInfo } from './create'

interface Package {
    name: string
    author: string
    template: {
        [propname: string]: string
    }
}
const pkg = require('../package.json') as Package

module.exports = ({ source, framework, version, projectName }: SelectInfo) => {
    // 进度实例
    const spinner = ora('Downloading please wait...');
    // spinner.color = 'yellow';
	// spinner.text = 'Loading rainbows';
    // 模版名称
    const templateName = `${framework}${version}`
    // 获取git地址
    const gitAddress = `${pkg.template[source as string]}/${templateName}`
    // 转圈
    spinner.start()
    // 下载模版
    download(`${gitAddress}/${templateName}`, `./${projectName}`, (err: any) => {
        // 下载失败
        if(err) {
            spinner.stop()
            // 输出错误信息
            console.log(chalk.red(err))
            // 结束进程
            return
        }
        // 下载成功: 读取下载时的pkg
        fs.readFile(`./${projectName}/package.json`, 'utf8', (err: any, data: string) => {
            // 读取失败
            if(err){
                spinner.stop()
                console.log(chalk.yellow(err))
                return
            }
            // 读取成功: 修改信息
            const copyData = JSON.parse(data)
            copyData.name = projectName
            copyData.author = pkg.author
            // 写入pkg
            fs.writeFile(`./${projectName}/package.json`, JSON.stringify(copyData, null, 2), (err: any) => {
                spinner.stop()
                // 写入失败
                if(err) return console.log(chalk.yellow(err))
                // 写入成功
                console.log(chalk.green('project init successfully!'))
                console.log(`
                    ${chalk.yellow(`cd ${projectName}`)}
                    ${chalk.yellow('npm install')}
                    ${chalk.yellow('npm run serve')}
                `);
            })
        })
    })
}