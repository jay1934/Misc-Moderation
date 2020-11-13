const { Client, Collection } = require('discord.js');
const { GiveawaysManager } = require('discord-giveaways');

const client = new Client();

client.giveawaysManager = new GiveawaysManager(client, {
  storage: './data/giveaways.json',
});
client.commands = new Collection();

require('./handlers/events.js').init(client);

client.login(require('./config.json').token);
