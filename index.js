const ws = require('./api/gosumemory');
const Banchojs = require("bancho.js");
const config = require('./config/configure');
const client = new Banchojs.BanchoClient({ username: config.osuUsername, password: config.osuIRCPassword });
const bot = require('./api/Twitch');
const functions = require('./api/functions');
const osuApiKey = config.osuApiKey;
const prequest = require('prequest');
let mapInfo = null;
if(ws !== null) {
ws.on('message', function incoming(data) {
  mapInfo = JSON.parse(data);
});
}; 
let client_channel;
client.connect().then(() => {
  console.log(`[\x1b[35mOTBfO\x1b[0m] Connected to OSU! Bancho`);
  client_channel = client.getUser(config.osuUsername);
}).catch(console.error);

bot.on('join', channel => {
  console.log(`[\x1b[35mOTBfO\x1b[0m] Twitch bot joined your channel: ${channel}`);
});

bot.on('error', err => {
  console.log(err);
});

bot.on('message', async chatter => {
  if(chatter.message === '!np' || chatter.message === '!map' || chatter.message === '!nowplay' || chatter.message === '!нп' || chatter.message === '!сонг') {
    if(mapInfo === null) return bot.say('Не удаётся получить играющую в данный момент песню. BibleThump');
    return bot.say(`${mapInfo.menu.bm.metadata.artist} - ${mapInfo.menu.bm.metadata.title} [${mapInfo.menu.bm.metadata.difficulty}] ${mapInfo.menu.bm.stats.fullSR} ☆ by ${mapInfo.menu.bm.metadata.mapper} | Download: https://osu.ppy.sh/b/${mapInfo.menu.bm.id}#${functions.gamemodesReplacer(mapInfo.menu.gameMode)}/${mapInfo.menu.bm.set}`);
  }
  if(chatter.message === '!skin' || chatter.message === '!cs' || chatter.message === '!скин') {
    if(mapInfo === null) return bot.say('Не удаётся получить папку со скином в данный момент. BibleThump');
    return bot.say(`Текущий скин: ${mapInfo.settings.folders.skin} GlitchCat`);
  }
  let link_tester = chatter.message.match(/(?:http:\/\/|https:\/\/)?(osu\.ppy\.sh\/)(beatmapsets|b)\/([0-9]*)#?(osu|taiko|catch|mania)?\/?([0-9]*)?\/?\+?([\S]*)?/ig);
  if(link_tester) {
    let link_matcher = link_tester[0].match(/^(?:http:\/\/|https:\/\/)?(osu\.ppy\.sh\/)(beatmapsets|b)\/([0-9]*)#?(osu|taiko|catch|mania)?\/?([0-9]*)?\/?\+?([\S]*)?/i);
    let bm;
    if(!link_matcher[4] || !link_matcher[5]) {
      let req = await prequest(`https://osu.ppy.sh/api/get_beatmaps?k=${osuApiKey}&s=${link_matcher[3]}`);
      if(req.length === 0) return;
      bm = req[req.length - 1];
    }
    if(!bm) {
      let req = await prequest(`https://osu.ppy.sh/api/get_beatmaps?k=${osuApiKey}&b=${link_matcher[5]}`);

      if(req.length === 0) return;
      bm = req[0];
    }
    let state = bm.approved;
        state = state.replace(/-2/, "Заброшенная (Graveyard)");
        state = state.replace(/-1/, "В разработке (WIP)");
        state = state.replace(/0/, "Ожидающая (Pending)");
        state = state.replace(/1/, "Рейтинговая (Ranked)");
        state = state.replace(/2/, "Одобренная (Approved)");
        state = state.replace(/3/, "Квалифицированная (Qualified)");
        state = state.replace(/4/, "Любимая (Loved)");
        await client_channel.sendMessage(`Реквест от ${chatter.display_name}: [http://osu.ppy.sh/b/${bm.beatmap_id} ${bm.artist} - ${bm.title} [${bm.version}]] ${Number(bm.difficultyrating).toFixed(2)}☆ ${bm.bpm} BPM ${bm.diff_approach}AR ${bm.diff_overall}OD ${Number(bm.total_length/60).toFixed(0)}:${Math.floor(Number(bm.total_length) - (Number(bm.total_length)/60).toFixed(0) * 60).toString().padStart(2, '0')}♫`);
        return bot.say(`Реквест добавлен: [${state}] ${bm.artist} - ${bm.title} ${Number(bm.difficultyrating).toFixed(2)} ☆ [${bm.version}] by ${bm.creator}`);
  }
});