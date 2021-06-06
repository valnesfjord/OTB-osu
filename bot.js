require('./handlers/checkconfigs');
const Twitch = require('./api/twitch');
const Bancho = require('./api/bancho');
const GOsuMemory = require('./api/gosumemory');
const ws = require('./api/ws');

(async () => {
	await GOsuMemory.spawn();
	await ws.connect();
	await Bancho.connect();
	await Twitch.connect();
})().catch((err) => {
	console.error(err);
});


