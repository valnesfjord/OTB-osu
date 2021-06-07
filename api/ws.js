const Ws = require('node-reconnect-ws');
const ws = new Ws({
    url: 'ws://localhost:24050/ws',
    reconnectInterval: 10000,
    autoConnect: false,
    maxRetries: Infinity
});
const { lang_kit } = require('../configHandle');

async function connect(){
    return new Promise((resolve) => {
        setTimeout(() => {
            ws.connect();
            resolve();
            }, 1000);
    });
}

ws.on('error', () => {
    console.log(`[\x1b[31mERROR\x1b[0m] ${lang_kit.ws_connect_error}`);
    module.exports.data = null;
});

ws.on('open', () => {
    console.log(`[\x1b[35mOTBfO\x1b[0m] ${lang_kit.ws_connected}`);
});

ws.on('message', (data) => {
    module.exports.data = JSON.parse(data);
});

module.exports.data = null;
module.exports.connect = connect;

//TODO: Сделать Lang_kit для апи