const prompts = require('prompts');
const { writeFileSync, readFileSync, existsSync } = require('fs');
const configPath = process.cwd()+'\\config\\config.json';
const languagePath = process.cwd()+'\\config\\languages.json';
const config = JSON.parse(readFileSync(configPath, { encoding:'utf-8' }));
const downloadGOSU = require('./downloadGOSU');
let language_kit;

async function start() {
	if (
		!config.osuApiKey ||
		!config.osuIRCPassword ||
		!config.osuUsername ||
		!config.twitch_bot_token ||
		!config.twitch_bot_username ||
		!config.twitch_channel_name
	) {
		process.title = 'OTBfO: First Boot';
		console.log(`[\x1b[35mOTBfO\x1b[0m] First boot setup!`);
		const language = await prompts({
			type: 'select',
			name: 'value',
			message: 'What language are you want to run bot on?:',
			choices: [
				{title: 'English', value: 'en'},
				{title: 'Russian', value: 'ru'},
			],
		});
		language_kit = require(languagePath)[`${language.value}_setup`];
		console.log(language_kit.information);
		const current_config = await prompts([
			{
				type: 'text',
				name: 'osuUsername',
				message: language_kit.osu_nick,
				validate: value => value === "" ? language.incorrect_string : true
			},
			{
				type: 'password',
				name: 'osuApiKey',
				message: language_kit.osu_apikey,
				validate: value => value === "" ? language.incorrect_string : true
			},
			{
				type: 'password',
				name: 'osuIRCPassword',
				message: language_kit.osu_ircpassword,
				validate: value => value === "" ? language.incorrect_string : true
			},
			{
				type: 'text',
				name: 'twitch_bot_username',
				message: language_kit.twitch_botlogin,
				validate: value => value === "" ? language.incorrect_string : true
			},
			{
				type: 'password',
				name: 'twitch_bot_token',
				message: language_kit.twitch_bottoken,
				validate: value => value === "" ? language.incorrect_string : true
			},
			{
				type: 'text',
				name: 'twitch_channel_name',
				message: language_kit.twitch_channellogin,
				validate: value => value === "" ? language.incorrect_string : true
			},
			{
				type: 'select',
				name: 'gosumemory_path',
				message: language_kit.gosumemory,
				choices: [
					{ title: language_kit.gosumemory_q1, value: 'download', description: language_kit.gosumemory_q1_tip },
					{ title: language_kit.gosumemory_q2, value: false, description: language_kit.gosumemory_q2_tip },
					{ title: language_kit.gosumemory_q3, value: 'path', description: language_kit.gosumemory_q3_tip },
					{ title: language_kit.gosumemory_q4, value: true, description: language_kit.gosumemory_q4_tip },
				],
			},
			{
				type: prev => prev === 'path' ? 'text' : null,
				name: 'gosumemory_path',
				message: language_kit.gosumemory_path,
				initial: process.cwd(),
				validate: value => existsSync(value + "\\gosumemory.exe") ? true : "Can't find gosumemory.exe in " + value
			}
		]);
		if (current_config.gosumemory_path === 'download') {
			const version = await prompts({
				type: 'select',
				name: 'value',
				message: language_kit.gosumemory_download,
				choices: [
					{ title: 'windows_386', value: 'windows_386' },
					{ title: 'windows_amd64', value: 'windows_amd64' },
					{ title: 'linux_386', value: 'linux_386' },
					{ title: 'linux_amd64', value: 'linux_amd64' }
				],
			});
			if (version.value != null) await downloadGOSU.start(version.value);
			current_config.gosumemory_path = true;
		}
		current_config.interface_language = language.value;
		writeFileSync('config/config.json', JSON.stringify(current_config, null, 2), (err) => {
			if (err) throw err;
		});
		console.log(`[\x1b[35mOTBfO\x1b[0m] ${language_kit.bot_start}`);
	}
}


module.exports = start();