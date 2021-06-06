const config = require('../handlers/configure');
const Bancho = new (require('bancho.js')).BanchoClient({
    username: config.osuUsername,
    password: config.osuIRCPassword
});
const Client = Bancho.getSelf();

async function connect() {
    return new Promise(((resolve, reject) => {
        Bancho
            .connect()
            .then(() => {
                console.log(`[\x1b[35mOTBfO\x1b[0m] Connected to osu! Bancho`);

                resolve();
            })
            .catch((err) => {
                console.log(`[\x1b[31mERROR\x1b[0m] Can't connect to osu! Bancho`);
                reject(err);
            });
    }));
}

async function say(message) {
    await Client.sendMessage(message);
}


module.exports = { connect, say };