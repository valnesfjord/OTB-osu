(async () => {
	await require('./api/gosumemory').spawn();
	await require('./api/bancho').connect();
	await require('./api/twitch').connect();
})().catch((err) => {
	console.error(err);
});
