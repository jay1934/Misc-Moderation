const fs = require('fs');

module.exports = {
  match: 'clear-?invites',
  async execute(_, message, [id]) {
    const err = (error) =>
      message.channel.send(error).then((msg) => msg.delete({ timeout: 4000 }));
    let member;
    try {
      member =
        message.mentions.members.first() ||
        (await message.guild.members.fetch({ user: id || true }));
    } catch (e) {
      return err(
        ":x: Please mention or provide the user ID of the member you'd like to check. **Make sure the member is in this guild**."
      );
    }

    if (
      member.roles.highest.position >= message.member.roles.highest.position &&
      message.member.id !== message.guild.ownerID
    )
      return err(
        "You can't clear the invites of someone who's highest role is above or equal to yours"
      );

    fs.writeFileSync(
      './data/invites.json',
      JSON.stringify(
        {
          ...JSON.parse(require('fs').readFileSync('./data/invites.json')),
          [member.id]: [],
        },
        '',
        2
      )
    );
    message.channel.send(
      `${member.user.tag}'s invites have been reset to zero`
    );
  },
};
