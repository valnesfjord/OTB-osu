const prequest = require('prequest');
const { lang_kit } = require('../configHandle');

module.exports = async () => {
	try {
		const req = await prequest('http://localhost:24050/json');
		if (req.error)
			return {
				error: true,
				console: console.log(`[\x1b[31mERROR\x1b[0m] ${lang_kit.ws_connect_error}`)
			};
		return req;
	} catch (error) {
		console.error(error);
		console.log(`[\x1b[31mERROR\x1b[0m] ${lang_kit.ws_connect_error}`);
		return null;
	}
};
