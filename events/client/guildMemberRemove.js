const fs = require('fs');

module.exports = (member, client) => {
  const users = JSON.parse(fs.readFileSync('./data/invites.json'));
  member.guild.fetchInvites().then((invites) => {
    const inviter = Object.entries(users).find(([, arr]) =>
      arr.includes(member.id)
    );

    if (!inviter) return;

    users[inviter[0]].splice(users[inviter[0]].indexOf(member.id), 1);

    fs.writeFileSync('./data/invites.json', JSON.stringify(users, '', 2));
    client.invites = invites;
  });
};
