const TwitchBot = require('twitch-bot');
const config = require('../config/configure');
const bot = new TwitchBot({
    username: config.twitch_bot_username,
    oauth: config.twitch_bot_token,
    channels: [config.twitch_channel_name]
});

module.exports = bot;
