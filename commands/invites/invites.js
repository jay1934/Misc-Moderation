module.exports = {
  match: 'invites',
  async execute(_, message, [id]) {
    let member;
    try {
      member =
        message.mentions.members.first() ||
        (await message.guild.members.fetch({ user: id || true }));
    } catch (e) {
      member = message.member;
    }

    const { [member.id]: invites } = JSON.parse(
      require('fs').readFileSync('./data/invites.json')
    );

    message.channel.send(
      `${member.user.tag} has ${invites ? invites.length : 0} invites.`
    );
  },
};
