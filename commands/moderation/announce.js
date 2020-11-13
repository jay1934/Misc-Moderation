const { MessageEmbed } = require('discord.js');

module.exports = {
  match: 'announce(ments)?',
  execute(_, message, [, ...announcement]) {
    message.delete();
    message.mentions.channels
      .first()
      .send(
        new MessageEmbed()
          .setColor('GREEN')
          .setDescription(announcement.join(' '))
          .setTitle('Announcement')
          .setAuthor(message.author.username, message.author.displayAvatarURL())
      );
  },
};
