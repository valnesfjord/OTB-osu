const config = require('./config/configure');
const ws = require('./api/gosumemory');
const fs = require('fs');
const Banchojs = require('bancho.js');
const client = new Banchojs.BanchoClient({ username: config.osuUsername, password: config.osuIRCPassword });
const bot = require('./api/Twitch');
const functions = require('./api/functions');
const osuApiKey = config.osuApiKey;
const prequest = require('prequest');
const commands = new (require('./commands/commands.js'));
const interface_language_kit = require('./config/languages.json')[`${config.interface_language}_interface`];


let mapInfo = null;

if (ws !== null) {
	ws.on('message', function incoming(data) {
		mapInfo = JSON.parse(data);
	});
}

let client_channel;
client
	.connect()
	.then(() => {
		console.log(`[\x1b[35mOTBfO\x1b[0m] Connected to OSU! Bancho`);
		client_channel = client.getUser(config.osuUsername);
	})
	.catch(console.error);

bot.on('join', (channel) => {
	console.log(`[\x1b[35mOTBfO\x1b[0m] Twitch bot joined your channel: ${channel}`);
});

bot.on('error', (err) => {
	console.log(err);
});

bot.on('message', async (chatter) => {
	switch(commands.findCommand(chatter.message)){
		case "np":
			if (mapInfo === null) return bot.say(interface_language_kit.error_finding_np);
			return bot.say(
				`${mapInfo.menu.bm.metadata.artist} - ${mapInfo.menu.bm.metadata.title} [${
					mapInfo.menu.bm.metadata.difficulty
				}] ${mapInfo.menu.bm.stats.fullSR} ☆ by ${mapInfo.menu.bm.metadata.mapper} | Download: osu.ppy.sh/b/${
					mapInfo.menu.bm.id
				}#${functions.gamemodesReplacer(mapInfo.menu.gameMode)}/${mapInfo.menu.bm.set}`
			);
		case "pp":
			if (mapInfo === null) return bot.say(interface_language_kit.error_finding_np);
			return bot.say(
				`100%: ${mapInfo.menu.pp['100']}pp | 99%: ${mapInfo.menu.pp['99']}pp | 98%: ${mapInfo.menu.pp['98']}pp | 97%: ${mapInfo.menu.pp['97']}pp | 96%: ${mapInfo.menu.pp['96']}pp | 95%: ${mapInfo.menu.pp['95']}pp`
			);
		case "skin":
			if (mapInfo === null) return bot.say(interface_language_kit.error_finding_skin);
			return bot.say(`${interface_language_kit.current_skin} ${mapInfo.settings.folders.skin} GlitchCat`);
		case "bot":
			return bot.say(
				`I'm Opensource Twitch bot For Osu: https://github.com/valnesfjord/OTB-osu | Author: valnesfjord; Many thanks: Pirasto| Kappa`
			);
	}
	let link_tester = chatter.message.match(
		/(?:http:\/\/|https:\/\/)?(osu\.ppy\.sh\/)(beatmapsets|b)\/([0-9]*)#?(osu|taiko|catch|mania)?\/?([0-9]*)?\/?\+?([\S]*)?/gi
	);
	if (link_tester) {
		let link_matcher = link_tester[0].match(
			/^(?:http:\/\/|https:\/\/)?(osu\.ppy\.sh\/)(beatmapsets|b)\/([0-9]*)#?(osu|taiko|catch|mania)?\/?([0-9]*)?\/?\+?([\S]*)?/i
		);
		let bm;
		if (!link_matcher[4] || !link_matcher[5]) {
			let req = await prequest(`https://osu.ppy.sh/api/get_beatmaps?k=${osuApiKey}&s=${link_matcher[3]}`);
			if (req.length === 0) return;
			bm = req[req.length - 1];
		}
		if (!bm) {
			let req = await prequest(`https://osu.ppy.sh/api/get_beatmaps?k=${osuApiKey}&b=${link_matcher[5]}`);

			if (req.length === 0) return;
			bm = req[0];
		}
		let state = bm.approved;
		state = state.replace(/-2/, interface_language_kit.map_graveyard);
		state = state.replace(/-1/, interface_language_kit.map_wip);
		state = state.replace(/0/, interface_language_kit.map_pending);
		state = state.replace(/1/, interface_language_kit.map_ranked);
		state = state.replace(/2/, interface_language_kit.map_approved);
		state = state.replace(/3/, interface_language_kit.map_qualified);
		state = state.replace(/4/, interface_language_kit.map_loved);
		await client_channel.sendMessage(
			`${chatter.display_name} >> [http://osu.ppy.sh/b/${bm.beatmap_id} ${bm.artist} - ${bm.title} [${
				bm.version
			}]] ${Number(bm.difficultyrating).toFixed(2)}☆ ${bm.bpm} BPM ${bm.diff_approach}AR ${
				bm.diff_overall
			}OD ${Number(bm.total_length / 60).toFixed(0)}:${Math.floor(
				Number(bm.total_length) - (Number(bm.total_length) / 60).toFixed(0) * 60
			)
				.toString()
				.padStart(2, '0')}♫`
		);
		return bot.say(
			`${interface_language_kit.request_added}[${state}] ${bm.artist} - ${bm.title} ${Number(
				bm.difficultyrating
			).toFixed(2)} ☆ [${bm.version}] by ${bm.creator}`
		);
	}
});

process.on('uncaughtException', (err, origin) => {
	fs.writeFileSync('errorlog', `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

process.on('unhandledRejection', (reason) => {
	console.error('ERROR: ', reason.stack || reason);
});
