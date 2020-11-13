module.exports = (client) => {
  console.log('Online');
  require('../../handlers/commands.js').init(client);
  require('../../handlers/timers.js').init(client);
  require('../../handlers/invites').init(client);
};
