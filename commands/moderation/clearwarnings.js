const fs = require('fs');

module.exports = {
  match: 'clearwarnings',
  async execute(_, message, [id, ...indexes]) {
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
        ":x: You cannot clear the warnings of somebody who's highest role is above or equal to yours"
      );

    if (!indexes.length)
      return err(
        `:x: Please specify the warning(s) to remove from ${member.user.username}.\nExample usage: \`-clearwarnings @${member.user.tag} 1\` or \`-clearwarnings @${member.user.tag} 1, 4, 5\``
      );

    const warns = indexes.join(' ').split(/, */);
    if (warns.map(Number).some(Number.isNaN))
      return err(
        `:x: One of the specified warnings is not a number!\nExample usage: \`-clearwarnings @${member.user.tag} 1\` or \`-clearwarnings @${member.user.tag} 1, 4, 5\``
      );

    const data = JSON.parse(fs.readFileSync('./data/warns.json'));
    const { [member.id]: warnings } = data;
    if (!warnings || !warnings.length)
      return err(`:x: ${member.user.username} does not have any warnings`);

    if (
      warns
        .sort((a, b) => a - b, 0)
        .some((idx1, idx2) => {
          if (!warnings[idx1 - idx2 - 1]) return true;
          warnings.splice(idx1 - idx2 - 1, 1);
          return false;
        })
    )
      return err(
        `:x: ${member.user.username} does not have a warning corresponding to one of the numbers listed!`
      );

    message.channel.send(`${warns.length} warnings have been cleared!`);
    fs.writeFileSync(
      './data/warns.json',
      JSON.stringify({ ...data, [member.id]: warnings }, '', 2)
    );
  },
};
