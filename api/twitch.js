const config = require('../handlers/configure');
const tmi = require('tmi.js');
const bot = new tmi.Client({
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: config.twitch_bot_username,
        password: config.twitch_bot_token
    },
    channels: [ config.twitch_channel_name ]
});
async function connect(){
    return new Promise(((resolve, reject) => {
        bot.connect()
            .then(() => {
                console.log(`[\x1b[35mOTBfO\x1b[0m] Twitch bot joined your channel: ${config.twitch_channel_name}`);
                require('./message');
                resolve();
            })
            .catch((err) => {
                console.log(`[\x1b[31mERROR\x1b[0m] Twitch bot unable to start`);
                reject(err);
            });
    }));
}


module.exports = {
    bot,
    connect
};
