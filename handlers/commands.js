const fs = require('fs');

exports.init = ({ commands }) =>
  fs.readdirSync('./commands').forEach((folder) => {
    fs.readdirSync(`./commands/${folder}`).forEach((file) => {
      const command = require(`../commands/${folder}/${file}`);
      commands.set(command.match, command);
    });
  });
