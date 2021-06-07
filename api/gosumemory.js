const folder = require('../configHandle').settings.gosumemory_folder + "\\gosumemory.exe";
const { lang_kit } = require('../configHandle');
const { execFile } = require('child_process');
const { existsSync } = require('fs');
const getOsuData = require('../api/osu');
const pslist = require('ps-list');

const correctPath = async () => {
	if (!folder) return false;
	if (existsSync('gosumemory.exe')) return 'gosumemory.exe';
	if (existsSync(folder)) return folder;
	return false;
};

const checkData = async () => {
	let once = false;
	return new Promise((resolve) => {
		const timer = setInterval(() => {
			getOsuData(false)
				.then((data) => {
					if (!once) {
						if (!data) {
							console.log('[\x1b[31mERROR\x1b[0m] '+lang_kit.error_finding_osu);
							once = true;
						}
					}
					if (data) {
						console.log('[\x1b[35mOTBfO\x1b[0m] ' +lang_kit.osu_started);
						resolve(true);
						clearInterval(timer);
					}
				});
		}, 1000);
	});
};

const isRunning = async () => {
	const list = await pslist({all: false});
	return new Promise((resolve) => {
		if(list.some((e) => e.name === 'gosumemory.exe')) {
			console.log(`[\x1b[35mOTBfO\x1b[0m] ${lang_kit.gosumemory_isrunning}`);
			resolve(checkData());
		} else resolve(false);
	});
};

const spawn = async () => {
	if (await isRunning()) return;
	const path = await correctPath();
	return new Promise((resolve, reject) => {
		if (path) {
			const child = execFile(`${path}`, (error) => {
				console.error(`[\x1b[31mERROR\x1b[0m] ${lang_kit.gosumemory_errored}`);
				reject(error);
			});
			if (child.pid) {
				console.log(`[\x1b[35mOTBfO\x1b[0m] ${lang_kit.gosumemory_waiting}`);
				checkData().then(resolve);
				child.stdout.on('data', (data) => {
					// data.toString().trim().split('\n').forEach((x) => {
					//
					// 	if (x.startsWith('Initialization complete')) {
					// 		console.log(`[\x1b[35mOTBfO\x1b[0m] ${lang_kit.gosumemory_started}`);
					//
					// 	}
					// });
				});
			}
		} else {
			resolve(getOsuData());
		}
	});
};
module.exports = {
	spawn
};


