exports.init = (client) =>
  client.guilds.cache
    .first()
    .fetchInvites()
    .then((invites) => {
      client.invites = invites;
    });
