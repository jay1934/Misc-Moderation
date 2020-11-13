const fs = require('fs');

module.exports = (member, client) => {
  const users = JSON.parse(fs.readFileSync('./data/invites.json'));
  member.guild.fetchInvites().then((invites) => {
    const invite = invites.find(
      ({ uses }, code) => client.invites.get(code).uses < uses
    );
    if (!invite.inviter) return;
    fs.writeFileSync(
      './data/invites.json',
      JSON.stringify(
        {
          ...users,
          [invite.inviter.id]: [...(users[invite.inviter.id] || []), member.id],
        },
        '',
        2
      )
    );
    client.invites = invites;
  });
};
