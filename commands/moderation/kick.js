const { MessageEmbed } = require('discord.js');

module.exports = {
  match: 'kick',
  async execute(_, message, [id, ...reason]) {
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

    if (member.user.bot) return err(":x: You can't ban a bot!");

    if (
      member.roles.highest.position >= message.member.roles.highest.position &&
      message.member.id !== message.guild.ownerID
    )
      return err(
        "You can't ban someone who's highest role is above or equal to yours"
      );

    if (
      member.roles.highest.position >= message.guild.me.roles.highest.positions
    )
      return err(
        `:x: My highest role is below or equal to ${member.user.username}'s!`
      );

    await member.kick();
    message.channel.send(
      `${member.user.tag} was kicked by ${message.member.tag}`
    );

    const embed = (dm) =>
      new MessageEmbed()
        .setColor('RED')
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setTitle(`${dm ? 'You were' : `${member.user.tag} was`} kicked!`)
        .addField('Reason:', reason.join(' ') || 'No reason provided')
        .setFooter(
          `Kicked by ${message.author.tag}`,
          message.member.displayAvatarURL
        );

    member.send(embed(true)).catch(() => {});
    message.guild.channels.cache
      .get(require('../../config.json').logChannelID)
      .send(embed());
  },
};
