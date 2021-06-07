const { watch, readFileSync } = require('fs');

class hotReload {
    constructor(configName = "", key = "") {
        this.configPath = process.cwd()+`//config//${configName}`;
        this.configFile = {};
        this.key = key;
        this.updateConfig();
        this.watchConfig();
    }

    get config(){
        return (this.key === "") ? this.configFile : this.configFile[this.key];
    }

    updateConfig(){
        this.configFile = JSON.parse(readFileSync(this.configPath, {encoding: 'utf-8'}));
    }
    watchConfig(){
        watch(this.configPath, (eventType) => {
            if(eventType === 'change') this.updateConfig();
        });
    }
    findCommand(input = ""){
        for (const i in this.configFile){
            for (const j of this.configFile[i]){
                if ("!"+j === input) return i;
            }
        }
        return "";
    }
}

module.exports = hotReload;