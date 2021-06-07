const { settings, commands, lang_kit} = require('../configHandle');
const { bot } = require('../api/twitch');
const Bancho = require('../api/bancho');
const ws = require('../api/ws');
const functions = require('../api/functions');
const osuApiKey = settings.osuApiKey;
const prequest = require('prequest');

bot.on("message", async (channel, chatter, message, self) => {
    if(self) return;
    switch(commands.findCommand(message)){
        case "np":
            if (ws.data === null) return bot.say(channel, lang_kit.error_finding_np);
            return bot.say(channel,
                `${ws.data.menu.bm.metadata.artist} - ${ws.data.menu.bm.metadata.title} [${
                    ws.data.menu.bm.metadata.difficulty
                }] ${ws.data.menu.bm.stats.fullSR} ☆ by ${ws.data.menu.bm.metadata.mapper} | Download: osu.ppy.sh/b/${
                    ws.data.menu.bm.id
                }#${functions.gamemodesReplacer(ws.data.menu.gameMode)}/${ws.data.menu.bm.set}`
            );
        case "pp":
            if (ws.data === null) return bot.say(channel,lang_kit.error_finding_np);
            return bot.say(channel,
                `100%: ${ws.data.menu.pp['100']}pp | 99%: ${ws.data.menu.pp['99']}pp | 98%: ${ws.data.menu.pp['98']}pp | 97%: ${ws.data.menu.pp['97']}pp | 96%: ${ws.data.menu.pp['96']}pp | 95%: ${ws.data.menu.pp['95']}pp`
            );
        case "skin":
            if (ws.data === null) return bot.say(channel,lang_kit.error_finding_skin);
            return bot.say(channel,`${lang_kit.current_skin} ${ws.data.settings.folders.skin} GlitchCat`);
        case "bot":
            return bot.say(channel,
                `${lang_kit.osu_bot}`
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
                state = state.replace(/-2/, lang_kit.map_graveyard);
                state = state.replace(/-1/, lang_kit.map_wip);
                state = state.replace(/0/, lang_kit.map_pending);
                state = state.replace(/1/, lang_kit.map_ranked);
                state = state.replace(/2/, lang_kit.map_approved);
                state = state.replace(/3/, lang_kit.map_qualified);
                state = state.replace(/4/, lang_kit.map_loved);
                await Bancho.say(
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
                return bot.say(channel,
                    `${lang_kit.request_added}[${state}] ${bm.artist} - ${bm.title} ${Number(
                        bm.difficultyrating
                    ).toFixed(2)} ☆ [${bm.version}] by ${bm.creator}`
                );
            }
        }
    }
});