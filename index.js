const { fork } = require('child_process');
const { appendFileSync } = require('fs');
const date = new Date();
const child = fork(__dirname+'//bot.js', {
    stdio: 'pipe'
});


child.stdout.on('data', (data) => {
    const log = data.toString().trim();
    if (log === "socket close" || log === "socket open" || log.endsWith('socket close')) return;
    console.log(log);
});

child.stderr.on('data', (data) => {
    console.error(`[ERROR] ${data.toString().trim()}`);
    appendFileSync('error.log', `[${date.toLocaleTimeString()}] ${data.toString().trim()}\n`);
});

child.on('exit', (code, signal) => {
    if (code !== 0) console.log('[\x1b[35mOTBfO\x1b[0m] Bot was crashed due some error');
    console.log('[\x1b[35mOTBfO\x1b[0m] Program will be closed in 10 seconds');
    setTimeout(() => { process.exit(signal); }, 10000);
});