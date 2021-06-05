const config = require('./handlers/checkconfigs');
const { TwitchConnect, bot } = require('./api/twitch');
const functions = require('./api/functions');
const { BanchoConnect } = require('./api/bancho');
const osuApiKey = config.osuApiKey;
const prequest = require('prequest');
const commands = new (require('./handlers/hotReload.js'))('commands.json');
const language_kit = new (require('./handlers/hotReload.js'))('languages.json', `${config.interface_language}_interface`);
const { ws, spawnGOSU } = require('./api/gosumemory');
let clientChannel;
let gosu;

process.title = 'OTBfO';

let mapInfo = null;

ws.on('message', (data) => {
	mapInfo = JSON.parse(data);
});

(async () => {
	await TwitchConnect();
	clientChannel = await BanchoConnect();
	await spawnGOSU();
	setTimeout(() => { ws.connect(); }, 5000);
})().catch((err) => {
	console.error(err);
});

bot.on('message', async (channel, chatter, message, self) => {
	if(self) return;
	switch(commands.findCommand(message)){
		case "np":
			if (mapInfo === null) return bot.say(language_kit.config.error_finding_np);
			return bot.say(
				`${mapInfo.menu.bm.metadata.artist} - ${mapInfo.menu.bm.metadata.title} [${
					mapInfo.menu.bm.metadata.difficulty
				}] ${mapInfo.menu.bm.stats.fullSR} ☆ by ${mapInfo.menu.bm.metadata.mapper} | Download: osu.ppy.sh/b/${
					mapInfo.menu.bm.id
				}#${functions.gamemodesReplacer(mapInfo.menu.gameMode)}/${mapInfo.menu.bm.set}`
			);
		case "pp":
			if (mapInfo === null) return bot.say(language_kit.config.error_finding_np);
			return bot.say(
				`100%: ${mapInfo.menu.pp['100']}pp | 99%: ${mapInfo.menu.pp['99']}pp | 98%: ${mapInfo.menu.pp['98']}pp | 97%: ${mapInfo.menu.pp['97']}pp | 96%: ${mapInfo.menu.pp['96']}pp | 95%: ${mapInfo.menu.pp['95']}pp`
			);
		case "skin":
			if (mapInfo === null) return bot.say(language_kit.config.error_finding_skin);
			return bot.say(`${language_kit.config.current_skin} ${mapInfo.settings.folders.skin} GlitchCat`);
		case "bot":
			return bot.say(
				`${language_kit.config.osu_bot}`
			);
		default: {
			const linkTester = message.match(
				/(?:http:\/\/|https:\/\/)?(osu\.ppy\.sh\/)(beatmapsets|b)\/([0-9]*)#?(osu|taiko|catch|mania)?\/?([0-9]*)?\/?\+?([\S]*)?/gi
			);
			if (linkTester) {
				const linkMatcher = linkTester[0].match(
					/^(?:http:\/\/|https:\/\/)?(osu\.ppy\.sh\/)(beatmapsets|b)\/([0-9]*)#?(osu|taiko|catch|mania)?\/?([0-9]*)?\/?\+?([\S]*)?/i
				);
				let bm;
				if (!linkMatcher[4] || !linkMatcher[5]) {
					const req = await prequest(
						`https://osu.ppy.sh/api/get_beatmaps?k=${osuApiKey}&s=${linkMatcher[3]}`
					);
					if (req.length === 0) return;
					bm = req[req.length - 1];
				}
				if (!bm) {
					const req = await prequest(
						`https://osu.ppy.sh/api/get_beatmaps?k=${osuApiKey}&b=${linkMatcher[5]}`
					);

					if (req.length === 0) return;
					bm = req[0];
				}
				let state = bm.approved;
				state = state.replace(/-2/, language_kit.config.map_graveyard);
				state = state.replace(/-1/, language_kit.config.map_wip);
				state = state.replace(/0/, language_kit.config.map_pending);
				state = state.replace(/1/, language_kit.config.map_ranked);
				state = state.replace(/2/, language_kit.config.map_approved);
				state = state.replace(/3/, language_kit.config.map_qualified);
				state = state.replace(/4/, language_kit.config.map_loved);
				await clientChannel.sendMessage(
					`${chatter.username} >> [http://osu.ppy.sh/b/${bm.beatmap_id} ${bm.artist} - ${bm.title} [${
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
					`${language_kit.config.request_added}[${state}] ${bm.artist} - ${bm.title} ${Number(
						bm.difficultyrating
					).toFixed(2)} ☆ [${bm.version}] by ${bm.creator}`
				);
			}
		}
	}
});
