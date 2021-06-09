const prequest = require('prequest');
const { lang_kit } = require('../configHandle');

module.exports = async (debug = true) => new Promise((resolve) => {
	prequest('http://localhost:24050/json')
		.then((req) => {
			if (req.error){
				if (debug) console.log(`[\x1b[31mERROR\x1b[0m] ${lang_kit.error_finding_osu}`);
				resolve(false);
			}
			resolve(req);
		})
		.catch(() => {
			//Нет смысла писать console.error так как ошибка предсказуемая и появляется только в одном случае
			if (debug) console.log(`[\x1b[31mERROR\x1b[0m] ${lang_kit.ws_connect_error}`); // Нет идей как не выводить это сообщение при старте
			resolve(null);
		});
});
