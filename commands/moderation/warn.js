const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  match: 'warn',
  async execute(_, message, [id, ...warning]) {
    const err = (error) =>
      message.channel.send(error).then((msg) => msg.delete({ timeout: 5000 }));

    if (!/^(<@!?\d{17,18}>|\d{17,18})$/.test(id))
      return err(
        ':x: Please provide a valid mention or user ID for the first argument'
      );

    let member;
    try {
      member =
        message.mentions.members.first() ||
        (await message.guild.members.fetch({ user: id }));
    } catch (e) {
      return err(
        ':x: You did not provide a valid user ID/mention, or it referenced a user who is not in this guild!'
      );
    }

    if (
      message.member.roles.highest.position <= member.roles.highest.position &&
      !message.member.hasPermission('ADMINISTRATOR')
    )
      return err(
        ":x: You cannot warn somebody who's highest role is above or equal to yours"
      );

    if (!warning[0]) return err(':x: You have to provide a warning message');

    message.channel.send(`${member.user.username} has been warned.`);
    const embed = (dm) =>
      new MessageEmbed()
        .setColor('RED')
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setTitle(`${dm ? 'You were' : `${member.user.tag} was`} warned!`)
        .addField('Warning:', warning.join(' '))
        .setFooter(
          `Warned by ${message.author.tag}`,
          message.member.displayAvatarURL
        );

    member.send(embed(true)).catch(() => {});
    message.guild.channels.cache
      .get(require('../../config.json').logChannelID)
      .send(embed());

    const warns = JSON.parse(fs.readFileSync('./data/warns.json'));
    warns[member.id] = [
      ...(warns[member.id] || []),
      { exec: message.author.id, warning: warning.join(' ') },
    ];
    fs.writeFileSync('./data/warns.json', JSON.stringify(warns, '', 2));
  },
};
