const ms = require('ms');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  match: '(temp|t)?mute',
  async execute(_, message, [id, duration, ...reason]) {
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

    if (!duration || Number.isNaN(ms(duration)) || +duration <= 0)
      return err(`:x: Please provide a valid duration for the mute`);

    const timers = JSON.parse(fs.readFileSync('./data/timers.json'));

    if (
      timers.some((entry) => entry.id === member.id && entry.action === 'muted')
    )
      return err(`:x: This member is already muted`);

    if (
      member.roles.highest.position >= message.member.roles.highest.position &&
      message.member.id !== message.guild.ownerID
    )
      return err(
        ":x: You can't mute someone who's highest role is above or equal to yours"
      );

    if (
      member.roles.highest.position >= message.guild.me.roles.highest.positions
    )
      return err(
        `:x: My highest role is below or equal to ${member.user.username}'s!`
      );

    message.guild.channels.cache
      .filter(({ type }) => type === 'text')
      .forEach((channel) => {
        const filtered = channel.messages.cache
          .filter(
            (msg) =>
              msg.author &&
              msg.author.id === message.member.id &&
              msg.createdTimestamp > Date.now() - 4.32e7
          )
          .keyArray();

        if (filtered.length) channel.bulkDelete(filtered);
      });
  
    const time = ms(ms(duration), { long: true });

    const data = {
      id: member.id,
      action: 'muted',
      date: Date.now() + ms(duration),
      duration: time,
      exec: message.author.tag,
      old: [...member.roles.cache.keys()],
    };

    require('../../handlers/timers.js').startTimer(
      data,
      timers.push(data) - 1,
      message.guild,
      timers
    );

    fs.writeFileSync('./data/timers.json', JSON.stringify(timers, '', 2));
    member.roles.set([require('../../config.json').mutedRoleID]);

    message.channel.send(
      `${member.user.tag} was muted by ${message.author.tag} for ${time}`
    );

    const embed = (dm) =>
      new MessageEmbed()
        .setColor('RED')
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setTitle(
          `${dm ? 'You were' : `${member.user.tag} was`} muted for ${time}!`
        )
        .addField('Reason:', reason.join(' ') || 'No reason provided')
        .setFooter(
          `Muted by ${message.author.tag}`,
          message.member.displayAvatarURL
        );

    member.send(embed(true)).catch(() => {});
    message.guild.channels.cache
      .get(require('../../config.json').logChannelID)
      .send(embed());
  },
};
