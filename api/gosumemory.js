const WebSocket = require('node-reconnect-ws');
const folder = require('../handlers/configure').gosumemory_folder;
const { execFile } = require('child_process');
const ws = new WebSocket({
	url: 'ws://localhost:24050/ws',
	reconnectInterval: 10000,
	autoConnect: false,
	maxRetries: Infinity
});

ws.on('error', () => {
		console.log(
			`[\x1b[31mERROR\x1b[0m] GOsuMemory WS connecting error. Maybe you don't start it. Please start GOsuMemory.`
		);
});

async function spawnGOSU(){
	if(folder){
		const path = (folder === true) ? 'gosumemory.exe' : `${folder}\\gosumemory.exe`;
		execFile(path, (err, data) => {
			if (err) {
				console.log("[\x1b[31mERROR\x1b[0m] Can't open gosumemory, you probably forgot to set gosumemory folder in config.json");
			}
			else{
				console.log("[\x1b[35mOTBfO\x1b[0m] Succesfully started gosumemory");
			}
		});
	}
}

module.exports = {
	ws,
	spawnGOSU
};









