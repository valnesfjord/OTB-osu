const WebSocket = require('ws');
try {
    const ws = new WebSocket('ws://localhost:24050/ws');
    ws.on('error', () => {
        console.log(`[\x1b[31mERROR\x1b[0m] GOsuMemory WS connecting error. Maybe you don't start it. Start GOsuMemory and restart this app.`); 
    });
    module.exports = ws;
} catch (error) {
    const ws = null;
    console.log(`[\x1b[31mERROR\x1b[0m] GOsuMemory WS connecting error. Maybe you don't start it. Start GOsuMemory and restart this app.`); 
    module.exports = ws;
}
