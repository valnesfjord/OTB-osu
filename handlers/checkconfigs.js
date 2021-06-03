const { writeFileSync, existsSync, mkdirSync } = require('fs');
const folderPath = process.cwd()+'\\config\\',
    configPath = folderPath+'config.json',
    commandsPath = folderPath+'commands.json',
    languagesPath = folderPath+'languages.json',
    defaultconf = require('./defaults/config.json'),
    defaultcomd = require('./defaults/commands.json'),
    defaultlang = require('./defaults/languages.json');
console.log(__dirname);
if(!existsSync(folderPath)){
    mkdirSync(folderPath);
}
if (!existsSync(configPath)){
    writeFileSync(configPath, JSON.stringify(defaultconf, null, 2));
}
if (!existsSync(commandsPath)){
    writeFileSync(commandsPath, JSON.stringify(defaultcomd, null, 2));
}
if (!existsSync(languagesPath)){
    writeFileSync(languagesPath, JSON.stringify(defaultlang, null, 2));
}

module.exports = require('./configure.js');

