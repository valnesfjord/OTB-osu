const { watch, readFileSync } = require('fs');
const path = require('path');
const configPath = path.join(__dirname+'/commands.json');

class commands {
    constructor() {
        this.configFile = {};
        this.updateConfig();
        this.watchConfig();
    }
    updateConfig(){
        this.configFile = JSON.parse(readFileSync(configPath, {encoding: 'utf-8'}));
    }
    watchConfig(){
        watch(configPath, (eventType) => {
            if(eventType === 'change') this.updateConfig();
        });
    }
    findCommand(input = ""){
        for (let i in this.configFile){
            for (let j of this.configFile[i]){
                if ("!"+j === input) return i;
            }
        }
        return "";
    }
}

module.exports = commands;