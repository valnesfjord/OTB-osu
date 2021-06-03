const WebSocket = require('node-reconnect-ws');
const folder = require('../handlers/configure').gosumemory_folder;
const { execFile } = require('child_process');
const pslist = require('ps-list');
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

async function isRunning(){
	const list = await pslist({all: false});
	return list.find((proc) => {
		if (proc.name === 'gosumemory.exe') {
			console.log("[\x1b[35mOTBfO\x1b[0m] Found gosumemory in process list, starting websocket");
			return true;
		}
		return false;
	});
}

async function spawnGOSU(){
	if (await isRunning() !== undefined) return;
	if (folder){
		const path = (folder === true) ? 'gosumemory.exe' : `${folder}\\gosumemory.exe`;
		const child = execFile(`${path}`, (error) => {
			if (error) console.log("[\x1b[31mERROR\x1b[0m] GOsumemory was wasn't started or closed reason, please restart the app");
		});
		if (child.pid) console.log("[\x1b[35mOTBfO\x1b[0m] GOsuMemory started");
	}
}

module.exports = {
	ws,
	spawnGOSU
};









