const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { merge } = require('merge-json');
const folderPath = process.cwd()+'\\config\\',
    configPath = folderPath+'config.json',
    commandsPath = folderPath+'commands.json',
    languagesPath = folderPath+'languages.json',
    defaultconf = require('../configHandle/defaults/config.json'),
    defaultcomd = require('../configHandle/defaults/commands.json'),
    defaultlang = require('../configHandle/defaults/languages.json');
const isEqual = (defaultconfig, currentconfig) => {
    if(Object.keys(currentconfig).length === Object.keys(defaultconfig).length){
        for (const i in defaultconfig){
            if (!Object.prototype.hasOwnProperty.call(currentconfig, i)) break;
            for(const j in defaultconfig[i]) {
                if (!Object.prototype.hasOwnProperty.call(currentconfig[i], j)) return false;
            }
        }
        return true;
    }
    return false;
};
if(!existsSync(folderPath)) mkdirSync(folderPath);
if (!existsSync(configPath)) writeFileSync(configPath, JSON.stringify(defaultconf, null, 2));
if (!existsSync(commandsPath)) writeFileSync(commandsPath, JSON.stringify(defaultcomd, null, 2));
if (!existsSync(languagesPath)) writeFileSync(languagesPath, JSON.stringify(defaultlang, null, 2));
const conf = require(configPath);
const comd = require(commandsPath);
const lang = require(languagesPath);
if(!isEqual(defaultconf, conf)) writeFileSync(configPath, JSON.stringify(merge(defaultconf, conf),null, 2));
if(!isEqual(defaultcomd, comd)) writeFileSync(commandsPath, JSON.stringify(merge(defaultcomd, comd),null, 2));
if(!isEqual(defaultlang, lang)) writeFileSync(languagesPath, JSON.stringify(merge(defaultlang, lang),null, 2));

module.exports = require('./setupconfig');

