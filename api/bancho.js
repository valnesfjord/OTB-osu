const config = require('../handlers/configure');
const Bancho = new (require('bancho.js')).BanchoClient({
    username: config.osuUsername,
    password: config.osuIRCPassword
});
const connect = async () => {
    Bancho
    .connect()
    .then(() => {
        console.log(`[\x1b[35mOTBfO\x1b[0m] Connected to OSU! Bancho`);
        return Bancho.getUser(config.osuUsername);
    })
    .catch(console.error);
};

module.exports = connect();