const WebSocket = require('node-reconnect-ws');
const folder = require('../handlers/configure').gosumemory_folder;
const { execFile } = require('child_process');
const { existsSync } = require('fs');
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

function correctPath(){
	if (!folder) return false;
	if (existsSync('gosumemory.exe')) return 'gosumemory.exe';
	if (existsSync(folder)) return folder;
	return false;
}

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
	const path = correctPath();
	return new Promise((resolve, reject) => {
		if (path){
			const child = execFile(`${path}`, (error) => {
				console.error("[\x1b[31mERROR\x1b[0m] GOsumemory wasn't started or closed, please folder path is correct");
				reject(error);
			});
			if (child.pid) {
				console.log("[\x1b[35mOTBfO\x1b[0m] GOsuMemory started");
				child.stdout.on('data', (data) => {
					data.toString().trim().split('\n').forEach((x) => { console.log(`[\x1b[36mGOsuMemory\x1b[0m] ${x}`); });
				});
				resolve(child);
			}
		}
		resolve();
	});
}

module.exports = {
	ws,
	spawnGOSU
};









