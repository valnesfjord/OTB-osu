const Ws = require('node-reconnect-ws');
const ws = new Ws({
    url: 'ws://localhost:24050/ws',
    reconnectInterval: 10000,
    autoConnect: false,
    maxRetries: Infinity
});

async function connect(){
    return new Promise((resolve) => {
        setTimeout(() => {
            ws.connect();
            resolve();
            }, 1000);
    });
}

ws.on('error', () => {
    console.log(
        `[\x1b[31mERROR\x1b[0m] GOsuMemory WS connecting error. Maybe you don't start it. Please start GOsuMemory.`
    );
    module.exports.data = null;
});

ws.on('open', () => {
    console.log(
        `[\x1b[35mOTBfO\x1b[0m] Connected to GOsuMemory WebSocket.`
    );
});

ws.on('message', (data) => {
    module.exports.data = JSON.parse(data);
});

module.exports.data = null;
module.exports.connect = connect;

//TODO: Сделать Lang_kit для апи