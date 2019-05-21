const { writeFile: _writeFile, readFile: _readFile } = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(_writeFile);
const readFile = promisify(_readFile);

const makeRow = ({title,description}) => `| ${title} | ${description} |`

const main = async () => {
    const template = await readFile(path.resolve('./bin/README.tpl.md'),'utf8');
    const commands = require('../package').contributes.commands;
    const tableBody = commands.map(makeRow).join('\n');
    await writeFile(path.resolve('README.md'),[
        template,
        '| Title | Description |', '|----|----|',tableBody
    ].join('\n'),'utf8')
};

main();