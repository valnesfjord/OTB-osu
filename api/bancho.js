const config = require('../handlers/configure');
const Bancho = new (require('bancho.js')).BanchoClient({
    username: config.osuUsername,
    password: config.osuIRCPassword
});
async function BanchoConnect() {
    return new Promise(((resolve, reject) => {
        Bancho
            .connect()
            .then(() => {
                console.log(`[\x1b[35mOTBfO\x1b[0m] Connected to OSU! Bancho`);
                resolve(Bancho.getUser(config.osuUsername));
            })
            .catch((err) => {
                console.log(`[\x1b[31mERROR\x1b[0m] Can't connect to OSU! Bancho`);
                reject(err);
            });
    }));
}

module.exports = { BanchoConnect };