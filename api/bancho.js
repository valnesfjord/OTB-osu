const { settings, lang_kit } = require('../configHandle');
const Bancho = new (require('bancho.js')).BanchoClient({
    username: settings.osuUsername,
    password: settings.osuIRCPassword
});
const Client = Bancho.getSelf();

async function connect() {
    return new Promise(((resolve, reject) => {
        Bancho
            .connect()
            .then(() => {
                console.log(`[\x1b[35mOTBfO\x1b[0m] ${lang_kit.bancho_connected}`);
                resolve();
            })
            .catch((err) => {
                console.log(`[\x1b[31mERROR\x1b[0m] ${lang_kit.bancho_disconnected}`);
                reject(err);
            });
    }));
}

async function say(message) {
    await Client.sendMessage(message);
}

module.exports = { connect, say };

//TODO: Сделать Lang_kit для апи