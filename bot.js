(async () => {
	await require('./api/gosumemory').spawn();
	await require('./api/twitch').connect();
	await require('./api/bancho').connect();
})().catch((err) => {
	console.error(err);
});
