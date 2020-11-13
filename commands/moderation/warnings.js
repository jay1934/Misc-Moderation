const { MessageEmbed } = require('discord.js');

module.exports = {
  match: 'warn(ing)?s',
  async execute(_, message, [id]) {
    const err = (error) =>
      message.channel.send(error).then((msg) => msg.delete({ timeout: 4000 }));

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

    const warnings = JSON.parse(
      require('fs').readFileSync('./data/warns.json')
    )[member.id];

    if (!warnings || !warnings.length)
      return message.channel.send(
        `${member.user.username} has not yet been warned.`
      );

    message.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setTitle(`${member.user.username}'s warns`)
        .setDescription(
          warnings
            .map(
              ({ warning, exec }, idx) =>
                `${idx + 1}. "${warning}" - <@${exec}>`
            )
            .join('\n')
        )
    );
  },
};
