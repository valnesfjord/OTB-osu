const settings = require('../configHandle').settings;
const { lang_kit } = require('../configHandle');
const tmi = require('tmi.js');
const bot = new tmi.Client({
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: settings.twitch_bot_username,
        password: settings.twitch_bot_token
    },
    channels: [ settings.twitch_channel_name ]
});

async function connect(){
    return new Promise(((resolve, reject) => {
        bot.connect()
            .then(() => {
                console.log(`[\x1b[35mOTBfO\x1b[0m] ${lang_kit.twitchbot_joined}${settings.twitch_channel_name}`);
                require('../handlers/message');
                resolve();
            })
            .catch((err) => {
                console.log(`[\x1b[31mERROR\x1b[0m] ${lang_kit.twitchbot_errored}`);
                reject(err);
            });
    }));
}


module.exports = {
    bot,
    connect
};
//TODO: Сделать Lang_kit для апи