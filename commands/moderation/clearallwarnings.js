const fs = require('fs');

module.exports = {
  match: 'clearallwarnings',
  async execute(_, message, [id]) {
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

    const warns = JSON.parse(fs.readFileSync('./data/warns.json'));
    if (!warns[member.id] || !warns[member.id][0])
      return err(':x: This user has not been warned yet!');

    if (
      message.member.roles.highest.position <= member.roles.highest.position &&
      !message.member.hasPermission('ADMINISTRATOR')
    )
      return err(
        ":x: You cannot clear the warnings of somebody who's highest role is above or equal to yours"
      );

    message.channel.send(
      `Ok, all ${warns[member.id].length} of ${
        member.user.username
      }'s warns have been cleared.`
    );

    fs.writeFileSync(
      './data/warns.json',
      JSON.stringify({ ...warns, [member.id]: [] })
    );
  },
};
