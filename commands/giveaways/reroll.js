module.exports = {
  match: 'reroll(-?giveaway)?',
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

    if (!giveaway.ended) return err(':x: This giveaway has not ended!');

    client.giveawaysManager
      .reroll(giveaway.messageID)
      .then(() => message.channel.send('Giveaway rerolled!'))
      .catch((e) => {
        console.error(e);
        err('An error occured...');
      });
  },
};
