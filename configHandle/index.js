const hotReload = require('./hotReload');

const settings = new hotReload('config.json');
const commands = new hotReload('commands.json');
// eslint-disable-next-line camelcase
const lang_kit = new hotReload('languages.json', `${settings.config.interface_language}_interface`);

module.exports.commands = commands;
module.exports.settings = settings.config;
module.exports.lang_kit = lang_kit.config;