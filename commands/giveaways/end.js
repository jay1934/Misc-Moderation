module.exports = {
  match: 'end(-?giveaway)?',
  execute(client, message, args) {
    const err = (error) =>
      message.channel.send(error).then((msg) => msg.delete({ timeout: 4000 }));

    if (!args[0])
      return err(':x: You have to specify a valid message ID or prize!');

    const giveaway = client.giveawaysManager.giveaways.find(
      (g) => g.prize === args.join(' ') || g.messageID === args[0]
    );

    if (!giveaway)
      return err(`:x: Unable to find a giveaway for \`${args.join(' ')}\`.`);

    if (giveaway.ended) return err('This giveaway has already ended!');

    client.giveawaysManager
      .edit(giveaway.messageID, {
        setEndTimestamp: Date.now(),
      })
      .then(() => message.channel.send('The giveaway has ended'))
      .catch((e) => {
        console.error(e);
        err('An error occured...');
      });
  },
};
