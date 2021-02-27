const readline = require('readline-sync');
const fs = require("fs");
const config = require('./config.json');


if(!config.osuApiKey || !config.osuIRCPassword || !config.osuUsername || !config.twitch_bot_token || !config.twitch_bot_username || !config.twitch_channel_name) {
    console.log(`[\x1b[35mOTBfO\x1b[0m] Первый старт!`);
    let osuUsername = readline.question('[\x1b[35mOTBfO\x1b[0m] Введите свой ник в осу: \n');
    if(!osuUsername || osuUsername === '') return console.log(`Неверное заполнение!`);
    let osuApiKey = readline.question('[\x1b[35mOTBfO\x1b[0m] Введите свой API ключ в осу (получить/создать можно тут: https://osu.ppy.sh/p/api/ из строки API Key) (Используется для получения информации о карте, хранится локально, никуда не отсылается): \n');
    if(!osuApiKey || osuApiKey === '') return console.log(`Неверное заполнение!`);
    let osuIRCPassword = readline.question('[\x1b[35mOTBfO\x1b[0m] Введите свой IRC пароль для доступа к сообщениям через банчо (получить/создать можно тут: https://osu.ppy.sh/p/irc строка Server Password) (Используется для отправки реквестов в лс, хранится локально, никуда не отсылается): \n');
    if(!osuIRCPassword || osuIRCPassword === '') return console.log(`Неверное заполнение!`);
    let twitch_bot_username = readline.question('[\x1b[35mOTBfO\x1b[0m] Введите свой логин для твитч бота (для этих целей можно создать новый аккаунт TWITCH): \n');
    if(!twitch_bot_username || twitch_bot_username === '') return console.log(`Неверное заполнение!`);
    let twitch_bot_token = readline.question('[\x1b[35mOTBfO\x1b[0m] Введите свой токен для твитч бота (получить/создать можно тут: https://twitchapps.com/tmi/, начинается с oauth) (Используется для взаимодействия с чатом, хранится локально, никуда не отсылается): \n');
    if(!twitch_bot_token || twitch_bot_token === '') return console.log(`Неверное заполнение!`);
    let twitch_channel_name = readline.question('[\x1b[35mOTBfO\x1b[0m] Введите логин вашего канала на твитче: \n');
    if(!twitch_channel_name || twitch_channel_name === '') return console.log(`Неверное заполнение!`);
    let current_config = {
        osuUsername: osuUsername,
        osuApiKey: osuApiKey,
        osuIRCPassword: osuIRCPassword,
        twitch_bot_username: twitch_bot_username,
        twitch_bot_token: twitch_bot_token,
        twitch_channel_name: twitch_channel_name
    };
    current_config = JSON.stringify(current_config, null, 2);
    fs.writeFileSync('config/config.json', current_config, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    console.log(`[\x1b[35mOTBfO\x1b[0m] Готово! Запускаю бота...`);
    module.exports = current_config;
} else {
    module.exports = config;
}