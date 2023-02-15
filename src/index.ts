const program = require('commander')
// 获取包信息
const pkg = require('../package');
program
// 版本
.version(pkg.version)
// 配置
.usage('<command> [option]')
// 匹配
.command('create <projectName>')
// 回调
.action((name: string) => {
	require('./create')(name)
})
// 使用
program.parse(process.argv);
// 未使用
if(!program.args.length){
	// 提示
	program.help()
}