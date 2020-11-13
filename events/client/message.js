module.exports = (message, client) => {
  if (message.author.bot || !message.content.startsWith('-') || !message.guild)
    return;
  const args = message.content.slice(1).split(/ +/);
  const commandName = args.shift();
  const command = client.commands.find((_, match) =>
    new RegExp(`^${match}$`, 'i').test(commandName)
  );

  if (!command) return;

  const config = require('../../config.json');
  const permissions = Object.entries(config.permissions).find(([name]) =>
    new RegExp(`^${command.match}$`).test(name)
  )[1];

  if (
    permissions.length &&
    !permissions.some((id) => message.member.roles.cache.has(id))
  )
    return message.channel.send(`:x: Insufficient permissions!`);

  try {
    command.execute(message.client, message, args);
  } catch (e) {
    message.channel.send('Something went wrong');
    console.log(e);
  }
};
