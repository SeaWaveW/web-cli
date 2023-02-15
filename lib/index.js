const program = require('commander');
const pkg = require('../package');
program
    .version(pkg.version)
    .usage('<command> [option]')
    .command('create <projectName>')
    .action((name) => {
    require('./create')(name);
});
program.parse(process.argv);
if (!program.args.length) {
    program.help();
}
