const readline = require('synchronous-user-input');
const fs = require('fs');
const path = require('path');
const configPath = path.join(process.cwd(),'config/config.json');
const config = JSON.parse(fs.readFileSync(configPath, { encoding:'utf-8' }));

if (
	!config.osuApiKey ||
	!config.osuIRCPassword ||
	!config.osuUsername ||
	!config.twitch_bot_token ||
	!config.twitch_bot_username ||
	!config.twitch_channel_name
) {
	console.log(`[\x1b[35mOTBfO\x1b[0m] First boot setup!`);
	let config_language = readline('[\x1b[35mOTBfO\x1b[0m] Quick start language (ru/en): \n');
	if (
		!config_language ||
		(config_language === '' && config_language.toLowerCase() !== 'ru' && config_language.toLowerCase() !== 'en')
	)
		return console.log(`Incorrect input!`);
	let language_kit = require('./languages.json')[`${config_language.toLowerCase()}_setup`];
	let osuUsername = readline(`[\x1b[35mOTBfO\x1b[0m] ${language_kit.osu_nick} \n`);
	if (!osuUsername || osuUsername === '') return console.log(`${language_kit.incorrect_sting}`);
	let osuApiKey = readline(`[\x1b[35mOTBfO\x1b[0m] ${language_kit.osu_apikey} \n`);
	if (!osuApiKey || osuApiKey === '') return console.log(`${language_kit.incorrect_sting}`);
	let osuIRCPassword = readline(`[\x1b[35mOTBfO\x1b[0m] ${language_kit.osu_ircpassword} \n`);
	if (!osuIRCPassword || osuIRCPassword === '') return console.log(`${language_kit.incorrect_sting}`);
	let twitch_bot_username = readline(`[\x1b[35mOTBfO\x1b[0m] ${language_kit.twitch_botlogin} \n`);
	if (!twitch_bot_username || twitch_bot_username === '') return console.log(`${language_kit.incorrect_sting}`);
	let twitch_bot_token = readline(`[\x1b[35mOTBfO\x1b[0m] ${language_kit.twitch_bottoken} \n`);
	if (!twitch_bot_token || twitch_bot_token === '') return console.log(`${language_kit.incorrect_sting}`);
	let twitch_channel_name = readline(`[\x1b[35mOTBfO\x1b[0m] ${language_kit.twitch_channellogin} \n`);
	if (!twitch_channel_name || twitch_channel_name === '') return console.log(`${language_kit.incorrect_sting}`);
	let interface_language = readline(`[\x1b[35mOTBfO\x1b[0m] ${language_kit.interface_language} \n`);
	if (
		!interface_language ||
		interface_language === '' ||
		(interface_language.toLowerCase() !== 'ru' && interface_language.toLowerCase() !== 'en')
	)
		return console.log(`Incorrect input!`);
	let current_config = {
		osuUsername: osuUsername,
		osuApiKey: osuApiKey,
		osuIRCPassword: osuIRCPassword,
		twitch_bot_username: twitch_bot_username,
		twitch_bot_token: twitch_bot_token,
		twitch_channel_name: twitch_channel_name,
		interface_language: interface_language
	};
	current_config = JSON.stringify(current_config, null, 2);
	fs.writeFileSync('config/config.json', current_config, (err) => {
		if (err) throw err;
		console.log('Data written to file');
	});
	console.log(`[\x1b[35mOTBfO\x1b[0m] ${language_kit.bot_start}`);
	module.exports = current_config;
} else {
	module.exports = config;
}
