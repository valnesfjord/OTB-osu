const folder = require('../configHandle').settings.gosumemory_folder+"\\gosumemory.exe";;
const { execFile } = require('child_process');
const { existsSync } = require('fs');
const pslist = require('ps-list');

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

async function spawn(){
	if (await isRunning() !== undefined) return;
	const path = correctPath();
	return new Promise((resolve, reject) => {
		if (path){
			const child = execFile(`${path}`, (error) => {
				console.error("[\x1b[31mERROR\x1b[0m] GOsumemory wasn't started or closed, please check that folder path is correct");
				reject(error);
			});
			if (child.pid) {
				console.log("[\x1b[35mOTBfO\x1b[0m] Waiting for gosumemory to initialize");
				child.stdout.on('data', (data) => {
					data.toString().trim().split('\n').forEach((x) => {
						if (x.startsWith('Initialization complete')) {
							console.log("[\x1b[35mOTBfO\x1b[0m] GOsuMemory Started");
							resolve();
						}
					});
					// data.toString().trim().split('\n').forEach((x) => { console.log(`[\x1b[36mGOsuMemory\x1b[0m] ${x}`); }); // Я не уверен нужно ли выводить сообщения с gosumemory
				});
				// setTimeout(() => {  }, 4000); //Give gosumemory time to initializate
			}
		}
		else{
			resolve();
		}
	});
}

module.exports = {
	spawn
};

//TODO: Сделать Lang_kit для апи








